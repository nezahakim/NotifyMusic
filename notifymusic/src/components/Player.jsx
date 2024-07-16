// src/components/Player.jsx
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  FastForwardIcon,
  RewindIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import {
  setProgress,
  setDuration,
  togglePlay,
  setVolume,
} from "../store/slices/playerSlice";
import Visualizer from "./Visualizer";

const Player = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, volume, progress, duration } = useSelector(
    (state) => state.player,
  );
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    dispatch(setProgress(audioRef.current.currentTime));
  };

  const handleLoadedMetadata = () => {
    dispatch(setDuration(audioRef.current.duration));
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
    audioRef.current.volume = newVolume;
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    dispatch(setProgress(time));
    audioRef.current.currentTime = time;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center w-1/4">
          <img
            src={currentTrack?.albumCover || "https://via.placeholder.com/50"}
            alt="Album Cover"
            className="w-16 h-16 rounded-md mr-4"
          />
          <div>
            <h3 className="font-semibold">
              {currentTrack?.title || "No track selected"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentTrack?.artist}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-1/2">
          <div className="flex items-center space-x-4 mb-2">
            <button className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
              <RewindIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => dispatch(togglePlay())}
              className="bg-primary text-white rounded-full p-3 hover:bg-primary/90"
            >
              {isPlaying ? (
                <PauseIcon className="h-8 w-8" />
              ) : (
                <PlayIcon className="h-8 w-8" />
              )}
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
              <FastForwardIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="w-full flex items-center">
            <span className="text-xs mr-2">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={handleSeek}
              className="w-full"
            />
            <span className="text-xs ml-2">{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center w-1/4 justify-end">
          <VolumeUpIcon className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <Visualizer audioRef={audioRef} />
    </motion.div>
  );
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default Player;
