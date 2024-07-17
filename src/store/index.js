// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./slices/playerSlice";
import playlistReducer from "./slices/playlistSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    playlist: playlistReducer,
    user: userReducer,
  },
});
