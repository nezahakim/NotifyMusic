// src/components/TrackItem.jsx
import React from "react";
import { PlayIcon } from "@heroicons/react/solid";

const TrackItem = ({ track }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/50"
          alt="Album Cover"
          className="w-12 h-12 rounded-md mr-4"
        />
        <div>
          <h3 className="font-semibold">{track.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {track.artist}
          </p>
        </div>
      </div>
      <button className="btn btn-primary">
        <PlayIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TrackItem;
