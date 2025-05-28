// src/features/contacts/contactSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Contact {
  id: string;
  name: string;
  avatar: string;
}

interface ContactState {
  contacts: Contact[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ContactState = {
  contacts: [],
  status: "idle",
  error: null,
};

const apiUrl = import.meta.env.VITE_API_URL;

// 1) fetchContacts now takes the token as its “arg”
//    and rejects with a string on error.
export const fetchContacts = createAsyncThunk<
  Contact[],
  string,
  { rejectValue: string }
>(
  "contacts/fetchContacts",
  async (token, { rejectWithValue }) => {
    try {
      const resp = await axios.get<{ contacts: Contact[] }>(
        `${apiUrl}/users/contacts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return resp.data.contacts;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 2) addContact takes an object { userId, token }
export const addContact = createAsyncThunk<
  Contact,
  { userId: string; token: string },
  { rejectValue: string }
>(
  "contacts/addContact",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      // hit the “add” endpoint
      await axios.post(
        `${apiUrl}/users/contacts/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // re-fetch the updated list and return the newly added contact
      const list = await axios.get<{ contacts: Contact[] }>(
        `${apiUrl}/users/contacts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const found = list.data.contacts.find(c => c.id === userId);
      if (!found) throw new Error("Contact not found after add"); 
      return found;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // fetchContacts
      .addCase(fetchContacts.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchContacts.fulfilled,
        (state, action: PayloadAction<Contact[]>) => {
          state.status = "succeeded";
          state.contacts = action.payload;
        }
      )
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load contacts";
      })

      // addContact
      .addCase(addContact.pending, state => {
        state.error = null;
      })
      .addCase(
        addContact.fulfilled,
        (state, action: PayloadAction<Contact>) => {
          state.contacts.push(action.payload);
        }
      )
      .addCase(addContact.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to add contact";
      });
  }
});

export default contactSlice.reducer;
