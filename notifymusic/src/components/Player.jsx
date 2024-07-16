// src/components/Player.jsx
import React, { useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  RewindIcon,
  FastForwardIcon,
} from "@heroicons/react/solid";

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: "Song Title",
    artist: "Artist Name",
  });

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/50"
            alt="Album Cover"
            className="w-12 h-12 rounded-md mr-4"
          />
          <div>
            <h3 className="font-semibold">{currentTrack.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentTrack.artist}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
            <RewindIcon className="h-6 w-6" />
          </button>
          <button
            onClick={togglePlay}
            className="bg-primary text-white rounded-full p-2 hover:bg-primary/90"
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </button>
          <button className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
            <FastForwardIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="w-1/3">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
