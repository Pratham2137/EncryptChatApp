import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./userProfile/userProfileSlice";
import contactReducer from "./contact/contactSlice";
import chatReducer from "./chat/chatSlice";
import socialReducer from "./social/socialSlice";

export const store = configureStore({
  reducer: {
    contacts: contactReducer,
    userProfile: userProfileReducer,
    chat:chatReducer,
    social: socialReducer,
  },
}); 

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
