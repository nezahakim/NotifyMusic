"use client";
import React, { useState } from "react";

interface AudioPlayerProps {
  songTitle: string;
  artistName: string;
  coverArt: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  songTitle,
  artistName,
  coverArt,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="max-w-sm mx-auto bg-black text-white rounded-3xl overflow-hidden shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm">9:41</span>
          <div className="w-16 h-6 bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <img
          className="w-full h-64 object-cover mb-4 rounded-lg"
          src={coverArt}
          alt="Cover Art"
        />
        <h2 className="text-2xl font-bold mb-1">{songTitle}</h2>
        <p className="text-gray-400 mb-4">{artistName}</p>
        <div className="flex justify-between items-center mb-4">
          <button className="focus:outline-none">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l-5-5 5-5z" />
              <path d="M10 5v10l-5-5 5-5z" />
            </svg>
          </button>
          <button
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center focus:outline-none"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 012 0v6a1 1 0 11-2 0V5zm1 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <button className="focus:outline-none">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 5v10l5-5-5-5z" />
              <path d="M12 5v10l5-5-5-5z" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <div className="bg-gray-700 rounded-full h-1">
            <div className="bg-white rounded-full h-1 w-1/3"></div>
          </div>
        </div>
        <button className="text-sm text-gray-400 focus:outline-none">
          Lyrics
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
