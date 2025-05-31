import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

/** --- TYPES --- **/

export interface Contact {
  _id:    string;
  name:   string;
  avatar: string;
}

export interface ChatPartner {
  _id:  string;
  name: string;
  avatar: string;
  desc?: string;
}

export interface Group {
  _id:         string;
  name:        string;
  avatarUrl?:  string;
  description: string;
}

/** --- STATE --- **/

interface SocialState {
  contacts: {
    list:   Contact[];
    status: "idle"|"loading"|"succeeded"|"failed";
    error:  string | null;
  };
  chats: {
    list:   ChatPartner[];
    status: "idle"|"loading"|"succeeded"|"failed";
    error:  string | null;
  };
  groups: {
    list:   Group[];
    status: "idle"|"loading"|"succeeded"|"failed";
    error:  string | null;
  };
}

const initialState: SocialState = {
  contacts: { list: [], status: "idle", error: null },
  chats:    { list: [], status: "idle", error: null },
  groups:   { list: [], status: "idle", error: null },
};

const apiUrl = import.meta.env.VITE_API_URL;

/** --- ASYNC THUNKS --- **/

// 1) load my contacts
export const fetchContacts = createAsyncThunk<
  Contact[],
  string,                 // token
  { rejectValue: string }
>("social/fetchContacts", async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get<{ contacts: Contact[] }>(
      `${apiUrl}/users/contacts`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.contacts;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message ?? err.message);
  }
});

// 2) load my one-to-one chat partners
export const fetchMyChats = createAsyncThunk<
  ChatPartner[],
  string,
  { rejectValue: string }
>("social/fetchMyChats", async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get<{ 
      chats: Array<{
        chatId: string;
        partnerName: string;
        partnerAvatar: string;
        lastMessage?: string;
      }>;
     }>(
      `${apiUrl}/chats/my`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // map into our ChatPartner interface
    return res.data.chats.map((c) => ({
      _id: c.chatId,
      name: c.partnerName,
      avatar: c.partnerAvatar,
      desc: c.lastMessage,        // or omit if you don't want a subtitle
    }));
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error ?? err.message);
  }
});

// 3) load my groups
export const fetchMyGroups = createAsyncThunk<
  Group[],
  string,
  { rejectValue: string }
>("social/fetchMyGroups", async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get<{ groups: Group[] }>(
      `${apiUrl}/users/groups`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.groups;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message ?? err.message);
  }
});

/** --- SLICE --- **/

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    // if you ever need to reset
    clearSocial(state) {
      state.contacts = initialState.contacts;
      state.chats    = initialState.chats;
      state.groups   = initialState.groups;
    },
  },
  extraReducers: builder => {
    // contacts
    builder
      .addCase(fetchContacts.pending,   s => { s.contacts.status = "loading";   s.contacts.error = null; })
      .addCase(fetchContacts.fulfilled, (s,a) => { s.contacts.status = "succeeded"; s.contacts.list = a.payload; })
      .addCase(fetchContacts.rejected,  (s,a) => { s.contacts.status = "failed";    s.contacts.error = a.payload!; });

    // chats
    builder
      .addCase(fetchMyChats.pending,   s => { s.chats.status = "loading";   s.chats.error = null; })
      .addCase(fetchMyChats.fulfilled, (s,a) => { s.chats.status = "succeeded"; s.chats.list = a.payload; })
      .addCase(fetchMyChats.rejected,  (s,a) => { s.chats.status = "failed";    s.chats.error = a.payload!; });

    // groups
    builder
      .addCase(fetchMyGroups.pending,   s => { s.groups.status = "loading";   s.groups.error = null; })
      .addCase(fetchMyGroups.fulfilled, (s,a) => { s.groups.status = "succeeded"; s.groups.list = a.payload;  })
      .addCase(fetchMyGroups.rejected,  (s,a) => { s.groups.status = "failed";    s.groups.error = a.payload!; });
  }
});

export const { clearSocial } = socialSlice.actions;
export default socialSlice.reducer;