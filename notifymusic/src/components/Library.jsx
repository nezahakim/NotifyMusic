// src/components/Library.jsx
import React from "react";
import TrackList from "./TrackList";

const Library = () => {
  const libraryTracks = [
    { id: 1, title: "Saved Song 1", artist: "Artist 1" },
    { id: 2, title: "Saved Song 2", artist: "Artist 2" },
    { id: 3, title: "Saved Song 3", artist: "Artist 3" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>
      <TrackList tracks={libraryTracks} />
    </div>
  );
};

export default Library;
