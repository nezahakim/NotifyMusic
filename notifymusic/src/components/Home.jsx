// src/components/Home.jsx
import React from "react";
import TrackList from "./TrackList";

const Home = () => {
  const featuredTracks = [
    { id: 1, title: "Song 1", artist: "Artist 1" },
    { id: 2, title: "Song 2", artist: "Artist 2" },
    { id: 3, title: "Song 3", artist: "Artist 3" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Featured Tracks</h1>
      <TrackList tracks={featuredTracks} />
    </div>
  );
};

export default Home;
