// src/components/Home.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import TrackList from "./TrackList";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("Featured");
  const categories = ["Featured", "Trending", "New Releases", "Your Favorites"];

  const featuredTracks = [
    {
      id: 1,
      title: "Song 1",
      artist: "Artist 1",
      cover: "https://via.placeholder.com/300",
      views: "1.2M",
      duration: "3:45",
    },
    // ... (add more tracks with views and duration)
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold mb-8 text-white">
          Discover Music
        </h1>
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <TrackList tracks={featuredTracks} />
      </motion.div>
    </div>
  );
};

export default Home;
