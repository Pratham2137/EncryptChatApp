import User from "../models/userModel.js";
import Group from "../models/groupModel.js";
import Chat from "../models/chatModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    // console.log("userId", userId);

    const user = await User.findById(userId).select(
      "_id name username desc email isOnline socketId contacts"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error fetching user profile", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const findUser = async (req, res) => {
  const { email, username } = req.query;

  // 1) require at least one
  if (!email && !username) {
    return res
      .status(400)
      .json({ message: "Please provide either email or username" });
  }

  // 2) build an $or filter from whatever was passed
  const orFilter = [];
  if (email) orFilter.push({ email });
  if (username) orFilter.push({ username });

  try {
    const user = await User.findOne({ $or: orFilter }).select(
      "_id name email username"
    ); // pick the fields you want

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Error finding user:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res
      .status(400)
      .json({ message: "Please provide a search term (email or username)." });
  }

  try {
    // load current user's contacts
    const me = await User.findById(req.user.userId).select("contacts");
    if (!me) throw new Error("Authenticated user not found");

    const regex = new RegExp(term, "i");
    const filter = {
      $or: [{ email: regex }, { username: regex }],
      _id: {
        // exclude self and already-contacts
        $nin: [...me.contacts, me._id],
      },
    };

    const users = await User.find(filter).select("_id name email username avatar desc");

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 1) POST /api/users/public-key
// (Save or update the user’s PUBLIC key as Base64)
export const setPublicKey = async (req, res) => {
  try {
    const userId = req.user.userId;       // from authenticateToken middleware
    const { publicKey } = req.body;       // single string, Base64
    if (!publicKey) {
      return res.status(400).json({ message: "Missing publicKey" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { publicKey },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error("setPublicKey error:", err);
    return res.status(500).json({ message: "Failed to save public key" });
  }
};

export const getPublicKey = async (req, res) => {
  try {
    const otherId = req.params.userId;
    const other = await User.findById(otherId).select("publicKey");
    if (!other) return res.status(404).json({ message: "User not found" });
    if (!other.publicKey)
      return res.status(404).json({ message: "Public key not set yet" });
    res.json({ publicKey: other.publicKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch public key" });
  }
};

// 2) POST /api/users/encrypted-private
//    (Save or update the user’s encrypted PRIVATE key under AES‐GCM)
export const setEncryptedPrivateKey = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { iv, ciphertext } = req.body;
    if (!iv || !ciphertext) {
      return res
        .status(400)
        .json({ message: "iv (Base64) and ciphertext (Base64) required" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        encryptedPrivateKey: {
          iv,
          ciphertext,
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error("setEncryptedPrivateKey error:", err);
    return res.status(500).json({ message: "Failed to save encrypted private key" });
  }
};

// 3) GET /api/users/encrypted-private/:userId
//    (Fetch the encryptedPrivateKey blob { iv, ciphertext } for a given user)
export const getEncryptedPrivateKey = async (req, res) => {
  try {
    const otherId = req.params.userId;
    const other = await User.findById(otherId).select("encryptedPrivateKey");
    if (!other) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      !other.encryptedPrivateKey ||
      !other.encryptedPrivateKey.iv ||
      !other.encryptedPrivateKey.ciphertext
    ) {
      return res
        .status(404)
        .json({ message: "No encrypted private key available for this user" });
    }
    return res.json(other.encryptedPrivateKey);
  } catch (err) {
    console.error("getEncryptedPrivateKey error:", err);
    return res.status(500).json({ message: "Failed to fetch encrypted private key" });
  }
};


export const getContacts = async (req, res) => {
  try {
    const me = await User.findById(req.user.userId).populate(
      "contacts",
      "_id name username email avatar desc"
    );

    if (!me) return res.status(404).json({ message: "User not found" });
    res.json({ contacts: me.contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// addContact
export const addContact = async (req, res) => {
  const contactId = req.params.id;
  if (contactId === req.user.id) {
    return res
      .status(400)
      .json({ message: "Cannot add yourself as a contact" });
  }

  try {
    const [me, them] = await Promise.all([
      User.findById(req.user.userId),
      User.findById(contactId),
    ]);
    if (!them)
      return res.status(404).json({ message: "User to add not found" });

    if (me.contacts.includes(them._id)) {
      return res.status(400).json({ message: "Already in contacts" });
    }

    me.contacts.push(them._id);
    them.contacts.push(me._id);

    await Promise.all([me.save(), them.save()]);
    res.json({ message: "Contact added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// removeContact
export const removeContact = async (req, res) => {
  const contactId = req.params.id;

  try {
    const [me, them] = await Promise.all([
      User.findById(req.user.id),
      User.findById(contactId),
    ]);
    if (!them) return res.status(404).json({ message: "User not found" });

    me.contacts = me.contacts.filter((id) => !id.equals(them._id));
    them.contacts = them.contacts.filter((id) => !id.equals(me._id));

    await Promise.all([me.save(), them.save()]);
    res.json({ message: "Contact removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChats = async (req, res) => {
  const me = await User.findById(req.user.userId).populate(
    "chats",
    "_id name avatar desc"
  );
  res.json({ chats: me.chats });
};

export const getGroups = async (req, res) => {
  try {
    const me = await User.findById(req.user.userId).populate(
      "groups",
      "_id name avatarUrl description"
    );
    if (!me) return res.status(404).json({ message: "User not found" });
    return res.json({ groups: me.groups });
  } catch (err) {
    console.error("Error in getGroups:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
