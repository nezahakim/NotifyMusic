// src/components/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import TrackList from "./TrackList";

const Home = () => {
  const featuredTracks = [
    {
      id: 1,
      title: "Song 1",
      artist: "Artist 1",
      cover: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      title: "Song 2",
      artist: "Artist 2",
      cover: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      title: "Song 3",
      artist: "Artist 3",
      cover: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      title: "Song 4",
      artist: "Artist 4",
      cover: "https://via.placeholder.com/300",
    },
    {
      id: 5,
      title: "Song 5",
      artist: "Artist 5",
      cover: "https://via.placeholder.com/300",
    },
    {
      id: 6,
      title: "Song 6",
      artist: "Artist 6",
      cover: "https://via.placeholder.com/300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-900 dark:to-purple-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">
          Featured Tracks
        </h1>
        <TrackList tracks={featuredTracks} />
      </motion.div>
    </div>
  );
};

export default Home;
