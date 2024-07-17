// src/store/slices/playerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  queue: [],
  shuffle: false,
  repeat: "off", // 'off', 'all', 'one'
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action) => {
      state.queue = state.queue.filter((track) => track.id !== action.payload);
    },
    skipTrack: (state, action) => {
      // Implement logic to skip to next or previous track
      // This will depend on your queue implementation and shuffle/repeat modes
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    toggleRepeat: (state) => {
      const modes = ["off", "all", "one"];
      const currentIndex = modes.indexOf(state.repeat);
      state.repeat = modes[(currentIndex + 1) % modes.length];
    },
  },
});

export const {
  setCurrentTrack,
  togglePlay,
  setVolume,
  setProgress,
  setDuration,
  addToQueue,
  removeFromQueue,
  skipTrack,
  toggleShuffle,
  toggleRepeat,
} = playerSlice.actions;

export default playerSlice.reducer;
