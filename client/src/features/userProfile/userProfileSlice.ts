// src/features/userProfile/userProfileSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState, AppDispatch } from "../store";
import { connectSocket } from "../../utils/socket";
import { fetchContacts } from "../contact/contactSlice";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  isOnline: boolean;
  socketId: string;
}

interface UserProfileState {
  data: UserProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  string,
  { rejectValue: string; dispatch: AppDispatch }
>(
  "userProfile/fetch",
  async (token, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.get<{ user: UserProfile }>(
        `${apiUrl}/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // immediately load contacts into your contact slice
      dispatch(fetchContacts(token));

      return res.data.user;
    } catch (err: any) {
      const message =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message;
      return rejectWithValue(message);
    }
  }
);

const initialState: UserProfileState = {
  data: null,
  status: "idle",
  error: null,
};

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        connectSocket(action.payload._id, action.payload.name);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Unknown error";
      });
  },
});

export default userProfileSlice.reducer;
