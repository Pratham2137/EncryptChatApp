// src/features/chat/chatSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface ChatMessage {
  id?: string;
  sender: string;
  text: string;
  createdAt: string;
}

interface ChatState {
  partnerId: string | null;
  partnerName: string;
  history: ChatMessage[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ChatState = {
  partnerId: null,
  partnerName: "",
  history: [],
  status: "idle",
  error: null,
};

export const fetchHistory = createAsyncThunk<
  ChatMessage[],
  { partnerId: string; token: string },
  { rejectValue: string }
>("chat/fetchHistory", async ({ partnerId, token }, { rejectWithValue }) => {
  try {
    const res = await axios.get<
      {
        _id: string;
        sender: string;
        ciphertext: string;
        createdAt: string;
      }[]
    >(`${import.meta.env.VITE_API_URL}/message/${partnerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // map ciphertext → text
    return res.data.map((msg) => ({
      id: msg._id,
      sender: msg.sender,
      text: msg.ciphertext,
      createdAt: msg.createdAt,
    }));
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.error ?? err.response?.data?.message ?? err.message
    );
  }
});

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    receiveMessage(state, action: PayloadAction<ChatMessage>) {
      const incoming = action.payload;
      // if we already have a message with same sender+timestamp, skip
      if (
        state.history.some(
          (m) =>
            m.sender === incoming.sender && m.createdAt === incoming.createdAt
        )
      ) {
        return;
      }
      state.history.push(incoming);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (s) => {
        s.status = "loading";
        s.history = [];     
      })
      .addCase(fetchHistory.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.history = a.payload;
      })
      .addCase(fetchHistory.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? a.error.message ?? "Unknown error";
      });
  },
});

export const { receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
