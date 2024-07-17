// src/store/slices/playerSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
  queue: [],
  history: [],
  shuffle: false,
  repeat: "off", // 'off', 'all', 'one'
  equalizer: {
    isEnabled: false,
    bass: 0,
    mid: 0,
    treble: 0,
    preset: "custom",
  },
  crossfade: 0, // in seconds
  radioMode: false,
  sleepTimer: null,
  lyrics: null,
  relatedTracks: [],
  error: null,
  isLoading: false,
};

// Async thunks
export const fetchTrackDetails = createAsyncThunk(
  "player/fetchTrackDetails",
  async (trackId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}`);
      if (!response.ok) throw new Error("Failed to fetch track details");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchLyrics = createAsyncThunk(
  "player/fetchLyrics",
  async (trackId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/lyrics/${trackId}`);
      if (!response.ok) throw new Error("Failed to fetch lyrics");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchRelatedTracks = createAsyncThunk(
  "player/fetchRelatedTracks",
  async (trackId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/related-tracks/${trackId}`);
      if (!response.ok) throw new Error("Failed to fetch related tracks");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
      state.progress = 0;
      state.duration = 0;
      state.lyrics = null;
      state.relatedTracks = [];
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
    clearQueue: (state) => {
      state.queue = [];
    },
    skipTrack: (state, action) => {
      const direction = action.payload;
      if (state.queue.length === 0 && !state.repeat) return;

      if (direction === "next") {
        if (state.repeat === "one") {
          // Restart the current track
          state.progress = 0;
        } else {
          const currentIndex = state.queue.findIndex(
            (track) => track.id === state.currentTrack.id,
          );
          let nextIndex;

          if (state.shuffle) {
            nextIndex = Math.floor(Math.random() * state.queue.length);
          } else {
            nextIndex = (currentIndex + 1) % state.queue.length;
          }

          state.currentTrack = state.queue[nextIndex];
          state.history.push(state.currentTrack);
        }
      } else if (direction === "prev") {
        if (state.progress > 3) {
          // If more than 3 seconds into the song, restart it
          state.progress = 0;
        } else if (state.history.length > 0) {
          state.currentTrack = state.history.pop();
        }
      }

      state.progress = 0;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    toggleRepeat: (state) => {
      const modes = ["off", "all", "one"];
      const currentIndex = modes.indexOf(state.repeat);
      state.repeat = modes[(currentIndex + 1) % modes.length];
    },
    setEqualizer: (state, action) => {
      state.equalizer = { ...state.equalizer, ...action.payload };
    },
    toggleEqualizerEnabled: (state) => {
      state.equalizer.isEnabled = !state.equalizer.isEnabled;
    },
    setCrossfade: (state, action) => {
      state.crossfade = action.payload;
    },
    toggleRadioMode: (state) => {
      state.radioMode = !state.radioMode;
    },
    setSleepTimer: (state, action) => {
      state.sleepTimer = action.payload;
    },
    clearSleepTimer: (state) => {
      state.sleepTimer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTrackDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTrack = action.payload;
        state.error = null;
      })
      .addCase(fetchTrackDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchLyrics.fulfilled, (state, action) => {
        state.lyrics = action.payload;
      })
      .addCase(fetchRelatedTracks.fulfilled, (state, action) => {
        state.relatedTracks = action.payload;
      });
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
  clearQueue,
  skipTrack,
  toggleShuffle,
  toggleRepeat,
  setEqualizer,
  toggleEqualizerEnabled,
  setCrossfade,
  toggleRadioMode,
  setSleepTimer,
  clearSleepTimer,
} = playerSlice.actions;

// Selectors
export const selectCurrentTrack = (state) => state.player.currentTrack;
export const selectIsPlaying = (state) => state.player.isPlaying;
export const selectVolume = (state) => state.player.volume;
export const selectProgress = (state) => state.player.progress;
export const selectDuration = (state) => state.player.duration;
export const selectQueue = (state) => state.player.queue;
export const selectShuffle = (state) => state.player.shuffle;
export const selectRepeat = (state) => state.player.repeat;
export const selectEqualizer = (state) => state.player.equalizer;
export const selectCrossfade = (state) => state.player.crossfade;
export const selectRadioMode = (state) => state.player.radioMode;
export const selectSleepTimer = (state) => state.player.sleepTimer;
export const selectLyrics = (state) => state.player.lyrics;
export const selectRelatedTracks = (state) => state.player.relatedTracks;
export const selectError = (state) => state.player.error;
export const selectIsLoading = (state) => state.player.isLoading;

export default playerSlice.reducer;
