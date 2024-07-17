// src/components/Player.jsx
import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SpeakerWaveIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  setProgress,
  setDuration,
  togglePlay,
  setVolume,
} from "../store/slices/playerSlice";

const Player = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, volume, progress, duration } = useSelector(
    (state) => state.player,
  );
  const audioRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  // Mock lyrics (replace with actual lyrics fetching in a real app)
  const mockLyrics = [
    "This is the first line of the song",
    "Here comes the second line",
    "Third line is here",
    "Fourth line of the lyrics",
    "Fifth line, still going strong",
    "Sixth line, almost there",
    "Seventh line, nearing the end",
    "Eighth and final line of the song",
  ];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const lyricsInterval = setInterval(() => {
      if (isPlaying) {
        setCurrentLyricIndex(
          (prevIndex) => (prevIndex + 1) % mockLyrics.length,
        );
      }
    }, 5000); // Change lyric every 5 seconds

    return () => clearInterval(lyricsInterval);
  }, [isPlaying]);

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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const expandedPlayerVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 border-t border-gray-200 dark:border-gray-700 py-4 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 ${
          isExpanded ? "h-screen" : "h-24"
        }`}
      >
        <div className="container mx-auto px-4 h-full flex flex-col justify-between">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                variants={expandedPlayerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-grow flex flex-col items-center justify-center"
              >
                <motion.img
                  src={
                    currentTrack?.albumCover ||
                    "https://via.placeholder.com/300"
                  }
                  alt="Album Cover"
                  className="w-64 h-64 rounded-full shadow-2xl mb-8"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentTrack?.title || "No track selected"}
                </h2>
                <p className="text-xl text-gray-200 mb-8">
                  {currentTrack?.artist}
                </p>
                <div className="w-full max-w-md">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full accent-yellow-300 bg-gray-300 dark:bg-gray-600 h-2 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-gray-200 text-sm mt-2">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-8 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:text-yellow-300 transition-colors"
                  >
                    <ChevronLeftIcon className="h-12 w-12" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch(togglePlay())}
                    className="bg-white text-purple-600 rounded-full p-6 hover:bg-yellow-300 hover:text-purple-700 transition-colors shadow-lg"
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-12 w-12" />
                    ) : (
                      <PlayIcon className="h-12 w-12" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:text-yellow-300 transition-colors"
                  >
                    <ChevronRightIcon className="h-12 w-12" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`flex items-center justify-between ${isExpanded ? "mt-auto" : ""}`}
          >
            <div className="flex items-center">
              <img
                src={
                  currentTrack?.albumCover || "https://via.placeholder.com/50"
                }
                alt="Album Cover"
                className="w-16 h-16 rounded-full mr-4 shadow-lg cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              />
              <div>
                <h3 className="font-bold text-white text-shadow">
                  {currentTrack?.title || "No track selected"}
                </h3>
                <p className="text-sm text-gray-200">{currentTrack?.artist}</p>
              </div>
            </div>
            {!isExpanded && (
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(togglePlay())}
                  className="bg-white text-purple-600 rounded-full p-2 hover:bg-yellow-300 hover:text-purple-700 transition-colors shadow-lg"
                >
                  {isPlaying ? (
                    <PauseIcon className="h-6 w-6" />
                  ) : (
                    <PlayIcon className="h-6 w-6" />
                  )}
                </motion.button>
                <div className="flex items-center">
                  <SpeakerWaveIcon className="h-5 w-5 mr-2 text-white" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 accent-yellow-300 bg-gray-300 dark:bg-gray-600 h-2 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white hover:text-yellow-300 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white py-2 px-4 text-center">
          <p className="text-sm font-medium">{mockLyrics[currentLyricIndex]}</p>
        </div>
      </motion.div>
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </>
  );
};

export default Player;
