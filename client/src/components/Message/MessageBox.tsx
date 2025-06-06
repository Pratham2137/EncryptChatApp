// src/components/Message/MessageBox.tsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../features/store";
import {
  FiSearch,
  FiPhone,
  FiVideo,
  FiInfo,
  FiMoreVertical,
  FiSmile,
  FiPaperclip,
  FiSend,
} from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { getSocket } from "../../utils/socket";
import { receiveMessage, fetchHistory } from "../../features/chat/chatSlice";
import { encryptAESGCM, decryptAESGCM } from "../../utils/crypto";

interface Props {
  section: "chats" | "contacts" | "groups";
  selectedId: string | null;
  sharedAESKey: CryptoKey | null;
}

const MessageBox: React.FC<Props> = ({ section, selectedId, sharedAESKey }) => {
  const dispatch = useDispatch();
  const me = useSelector((s: RootState) => s.userProfile.data)!;
  const rawHistory = useSelector((s: RootState) => s.chat.history);
  const partnerId = selectedId;
  const { getToken } = useAuth();
  const token = getToken()!;
  const partner =
    section === "groups"
      ? useSelector((s: RootState) =>
          s.social.groups.list.find((g) => g._id === selectedId)
        )
      : useSelector((s: RootState) =>
          s.social.chats.list.find((c) => c._id === selectedId)
        );

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [text, setText] = useState("");
  // This will hold the fully decrypted messages (or fallback to ciphertext)
  const [decryptedHistory, setDecryptedHistory] = useState<
    Array<{
      id: string;
      sender: string;
      text: string;
      createdAt: string;
      iv: string;
      ciphertext: string;
    }>
  >([]);

  useEffect(() => {
    if (!sharedAESKey) {
      setDecryptedHistory([]);
      return;
    }

    (async () => {
      const arr = await Promise.all(
        rawHistory.map(async (msg) => {
          // (1) If either iv OR ciphertext is missing, just show msg.text (if it exists), or else placeholder:
          if (!msg.iv || !msg.ciphertext) {
            return {
              id: msg.id!,
              sender: msg.sender,
              text: (msg as any).text ?? "[corrupted message]",
              createdAt: msg.createdAt,
              iv: msg.iv || "",
              ciphertext: msg.ciphertext || "",
            };
          }
          // console.log("Decrypting message", msg);

          // (2) Otherwise, attempt to decrypt the valid iv/ciphertext pair:
          try {
            const plain = await decryptAESGCM(
              sharedAESKey,
              msg.iv,
              msg.ciphertext
            );
            return {
              id: msg.id!,
              sender: msg.sender,
              text: plain,
              createdAt: msg.createdAt,
              iv: msg.iv,
              ciphertext: msg.ciphertext,
            };
          } catch (decErr) {
            console.error("Failed to decrypt message", msg, decErr);
            // Fallback: if the Redux slice already has a `.text` field, use it;
            // otherwise show a generic “[corrupted message]”
            if (typeof (msg as any).text === "string") {
              return {
                id: msg.id!,
                sender: msg.sender,
                text: (msg as any).text,
                createdAt: msg.createdAt,
                iv: msg.iv,
                ciphertext: msg.ciphertext,
              };
            }
            return {
              id: msg.id!,
              sender: msg.sender,
              text: "[corrupted message]",
              createdAt: msg.createdAt,
              iv: msg.iv,
              ciphertext: msg.ciphertext,
            };
          }
        })
      );

      setDecryptedHistory(arr);
    })();
  }, [rawHistory, sharedAESKey]);

  useEffect(() => {
    if (partnerId && token) {
      dispatch(fetchHistory({ partnerId, token }));
    }
  }, [partnerId, token, dispatch]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [decryptedHistory]);

  // ─── Listen for real-time incoming sockets ───
  useEffect(() => {
    if (!partnerId || !sharedAESKey) return;
    const socket = getSocket();

    const handler = (_payload: {
      _id: string;
      sender: string;
      iv: string;
      ciphertext: string;
      createdAt: string;
    }) => {
      // Whenever we receive a socket event, re-fetch history:
      dispatch(fetchHistory({ partnerId, token }));
    };

    socket.on("receive-message", handler);
    return () => {
      socket.off("receive-message", handler);
    };
  }, [partnerId, sharedAESKey, dispatch, token]);

  const send = async () => {
    if (!partnerId || !text.trim() || !sharedAESKey) return;
    const createdAt = new Date().toISOString();

    // Encrypt
    const { iv, ciphertext } = await encryptAESGCM(sharedAESKey, text);

    // emit
    getSocket().emit("send-message", {
      sender: me._id,
      receiver: partnerId,
      iv,
      ciphertext,
      createdAt,
    });

    // ▷ Instead of local‐state push, dispatch into Redux with plaintext:
    dispatch(
      receiveMessage({
        id: "temp-" + createdAt,
        sender: me._id,
        iv,
        ciphertext,
        createdAt,
        text, // optimistic cleartext
      })
    );

    // Clear input
    setText("");

    // Persist on server
    await fetch(`${import.meta.env.VITE_API_URL}/message/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiver: partnerId, ciphertext, iv, createdAt }),
    });
  };

  if (!partnerId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a {section.slice(0, -1)} to view messages
      </div>
    );
  }

  // Filter by searchTerm on the _decrypted_ text field
  const messagesToShow = decryptedHistory
    .filter((m) =>
      (m.text ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          {partner?.avatar ? (
            <img
              src={partner.avatar + `/boy?username=${partner?.name}`}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300" />
          )}
          <span className="font-semibold text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
            {partner?.name}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 relative">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute top-1/2 left-2 -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search…"
              className="
                w-32 pl-8 pr-2 py-1 rounded-md
                bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)]
                border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
                text-sm text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]
                placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]
              "
            />
          </div>

          <button className="p-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] hover:text-[var(--color-primary)]">
            <FiPhone size={18} />
          </button>
          <button className="p-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] hover:text-[var(--color-primary)]">
            <FiVideo size={18} />
          </button>
          <button className="p-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] hover:text-[var(--color-primary)]">
            <FiInfo size={18} />
          </button>

          {/* three-dots menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1 text-[var(--color-text)] dark:text-[var(--color-text-darkmode)] hover:text-[var(--color-primary)]"
            >
              <FiMoreVertical size={18} />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-36 bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]
                            border border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
                            rounded-md shadow-lg z-50"
              >
                <ul className="flex flex-col">
                  <li className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer">
                    Archive
                  </li>
                  <li className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer">
                    Mute
                  </li>
                  <li className="px-4 py-2 hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-border-darkmode)] cursor-pointer text-[var(--color-error)]">
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Scroll */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 bg-[var(--color-background)] dark:bg-[var(--color-background-darkmode)] space-y-4"
      >
        {messagesToShow.map((m, i) => (
          <div
            key={m.createdAt + i}
            className={`
              max-w-xs p-3 rounded-lg
              ${
                m.sender === me._id
                  ? "ml-auto bg-[var(--color-primary-light)] dark:bg-[var(--color-primary-light-darkmode)]"
                  : "mr-auto bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]"
              }
            `}
          >
            <div className="text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]">
              {m.text}
            </div>
            <div className="mt-1 text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-darkmode)] text-right">
              {new Date(m.createdAt)
                .toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
                .toLowerCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 p-4 border-t border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]">
        <button className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          <FiSmile size={20} />
        </button>
        <button className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          <FiPaperclip size={20} />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 px-3 py-2 rounded-full border bg-[var(--color-card)] dark:bg-[var(--color-card-darkmode)]
            border-[var(--color-border)] dark:border-[var(--color-border-darkmode)]
            text-[var(--color-text)] dark:text-[var(--color-text-darkmode)]
            placeholder:text-[var(--color-text-secondary)] dark:placeholder:text-[var(--color-text-secondary-darkmode)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-darkmode)]"
        />
        <button
          onClick={send}
          className="p-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] 
            text-white rounded-full transition"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
