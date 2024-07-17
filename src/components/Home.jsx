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
      cover: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Song 2",
      artist: "Artist 2",
      cover: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Song 3",
      artist: "Artist 3",
      cover: "https://via.placeholder.com/150",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={track.cover}
                alt={track.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {track.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {track.artist}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
