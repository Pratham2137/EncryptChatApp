import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./userProfile/userProfileSlice";
import contactReducer from "./contact/contactSlice";
import chatReducer from "./chat/chatSlice";

export const store = configureStore({
  reducer: {
    contacts: contactReducer,
    userProfile: userProfileReducer,
    chat:chatReducer,
  },
}); 

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
