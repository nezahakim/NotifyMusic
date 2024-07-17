// src/components/TrackList.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

const TrackList = ({ tracks }) => {
  return (
    <div className="space-y-4">
      {tracks.map((track, index) => (
        <TrackItem key={track.id} track={track} index={index} />
      ))}
    </div>
  );
};

const TrackItem = ({ track, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center p-2">
        <div className="relative w-16 h-16 mr-4 flex-shrink-0">
          <img
            src={track.cover}
            alt={track.title}
            className="w-full h-full object-cover rounded"
          />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              >
                <button
                  className="text-white p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <PauseIcon className="h-6 w-6" />
                  ) : (
                    <PlayIcon className="h-6 w-6" />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-white mb-1">
            {track.title}
          </h3>
          <p className="text-sm text-gray-400">{track.artist}</p>
        </div>
        <div className="flex items-center space-x-4 text-gray-400">
          <div className="flex items-center">
            <ChartBarIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{track.views}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{track.duration}</span>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="bg-gray-700 px-4 py-2 overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="text-gray-300 hover:text-white transition-colors duration-200">
                  Add to playlist
                </button>
                <button className="text-gray-300 hover:text-white transition-colors duration-200">
                  Share
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Quality:</span>
                <select className="bg-gray-600 text-white text-sm rounded px-2 py-1">
                  <option>320kbps</option>
                  <option>160kbps</option>
                  <option>96kbps</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TrackList;
