import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bass: 0,
  mid: 0,
  treble: 0,
  isEnabled: false,
  preset: "custom",
};

export const setEqualizer = "";

const equalizerSlice = createSlice({
  name: "equalizer",
  initialState,
  reducers: {
    setBand: (state, action) => {
      const { band, value } = action.payload;
      state[band] = value;
      state.preset = "custom";
    },
    setPreset: (state, action) => {
      const preset = action.payload;
      switch (preset) {
        case "flat":
          state.bass = 0;
          state.mid = 0;
          state.treble = 0;
          break;
        case "rock":
          state.bass = 4;
          state.mid = -2;
          state.treble = 2;
          break;
        case "pop":
          state.bass = -1;
          state.mid = 2;
          state.treble = 3;
          break;
        case "jazz":
          state.bass = 3;
          state.mid = 1;
          state.treble = 1;
          break;
        case "classical":
          state.bass = 2;
          state.mid = 0;
          state.treble = -1;
          break;
        default:
        // Keep current settings
      }
      state.preset = preset;
    },
    toggleEqualizer: (state) => {
      state.isEnabled = !state.isEnabled;
    },
    resetEqualizer: (state) => {
      state.bass = 0;
      state.mid = 0;
      state.treble = 0;
      state.preset = "flat";
    },
  },
});

export const { setBand, setPreset, toggleEqualizer, resetEqualizer } =
  equalizerSlice.actions;

export default equalizerSlice.reducer;

// Selectors
export const selectEqualizerSettings = (state) => state.equalizer;
export const selectEqualizerEnabled = (state) => state.equalizer.isEnabled;
