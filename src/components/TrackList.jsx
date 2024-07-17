// src/components/TrackList.jsx
import React from "react";
import { motion } from "framer-motion";

const TrackList = ({ tracks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tracks.map((track, index) => (
        <TrackItem key={track.id} track={track} index={index} />
      ))}
    </div>
  );
};

const TrackItem = ({ track, index }) => {
  const layouts = [
    "col-span-1 row-span-1", // Square
    "col-span-1 row-span-2", // Vertical rectangle
    "col-span-2 row-span-1", // Horizontal rectangle
  ];

  const layout = layouts[index % 3];

  return (
    <motion.div
      className={`${layout} relative overflow-hidden rounded-xl shadow-lg group`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-75 transition-opacity duration-300 group-hover:opacity-90" />
      <img
        src={track.cover}
        alt={track.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <motion.h3
          className="text-xl font-bold text-white mb-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {track.title}
        </motion.h3>
        <motion.p
          className="text-sm text-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {track.artist}
        </motion.p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-white text-purple-600 rounded-full p-2 shadow-md hover:bg-purple-100 transition-colors duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default TrackList;
