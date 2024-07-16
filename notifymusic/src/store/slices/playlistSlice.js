// src/store/slices/playlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPlaylists = createAsyncThunk(
  "playlist/fetchPlaylists",
  async () => {
    const response = await axios.get("/api/playlists");
    return response.data;
  },
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    playlists: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addPlaylist: (state, action) => {
      state.playlists.push(action.payload);
    },
    removePlaylist: (state, action) => {
      state.playlists = state.playlists.filter(
        (playlist) => playlist.id !== action.payload,
      );
    },
    updatePlaylistOrder: (state, action) => {
      state.playlists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.playlists = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addPlaylist, removePlaylist, updatePlaylistOrder } =
  playlistSlice.actions;

export default playlistSlice.reducer;
