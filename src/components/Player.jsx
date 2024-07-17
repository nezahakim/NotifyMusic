// src/components/Player.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  PlayIcon,
  PauseIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SpeakerWaveIcon,
  ArrowsRightLeftIcon,
  ArrowPathRoundedSquareIcon,
  QueueListIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import {
  setProgress,
  setDuration,
  togglePlay,
  setVolume,
  nextTrack,
  previousTrack,
  toggleShuffle,
  toggleRepeat,
} from "../store/slices/playerSlice";

const Player = () => {
  const dispatch = useDispatch();
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    queue,
    shuffleMode,
    repeatMode,
  } = useSelector((state) => state.player);
  const [expanded, setExpanded] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const audioRef = useRef(null);

  // Mock lyrics (replace with actual lyrics fetching logic)
  const lyrics = [
    "This is the first line of the song",
    "Here comes the second line",
    "And now the third line of lyrics",
    "The song goes on with the fourth line",
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
        setCurrentLyricIndex((prevIndex) =>
          prevIndex < lyrics.length - 1 ? prevIndex + 1 : 0
        );
      }
    }, 5000); // Change lyrics every 5 seconds (adjust as needed)

    return () => clearInterval(lyricsInterval);
  }, [isPlaying, lyrics.length]);

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

  const handlers = useSwipeable({
    onSwipedUp: () => setExpanded(true),
    onSwipedDown: () => setExpanded(false),
    onSwipedLeft: () => dispatch(nextTrack()),
    onSwipedRight: () => dispatch(previousTrack()),
  });

  const playerVariants = {
    collapsed: { height: "6rem" },
    expanded: { height: "100vh" },
  };

  return (
    <motion.div
      {...handlers}
      variants={playerVariants}
      initial="collapsed"
      animate={expanded ? "expanded" : "collapsed"}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 border-t border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 overflow-hidden"
    >
      <div className="container mx-auto px-4 h-full flex flex-col">
        <div className="flex items-center justify-between h-24">
          <motion.img
            src={currentTrack?.albumCover || "https://via.placeholder.com/50"}
            alt="Album Cover"
            className="w-16 h-16 rounded-full shadow-lg"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
          <div className="flex-1 mx-4">
            <h3 className="font-bold text-white text-shadow truncate">
              {currentTrack?.title || "No track selected"}
            </h3>
            <p className="text-sm text-gray-200 truncate">{currentTrack?.artist}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(togglePlay())}
            className="bg-white text-purple-600 rounded-full p-3 hover:bg-yellow-300 hover:text-purple-700 transition-colors shadow-lg"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isPlaying ? "pause" : "play"}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                {isPlaying ? (
                  <PauseIcon className="h-8 w-8" />
                ) : (
                  <PlayIcon className="h-8 w-8" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setExpanded(!expanded)}
            className="ml-4 text-white"
          >
            <ChevronDownIcon className={`h-6 w-6 transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </motion.button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="mt-8 text-center">
                <motion.img
                  src={currentTrack?.albumCover || "https://via.placeholder.com/300"}
                  alt="Album Cover"
                  className="w-64 h-64 rounded-lg shadow-2xl mx-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <h2 className="text-2xl font-bold text-white mt-4">{currentTrack?.title}</h2>
                <p className="text-xl text-gray-200">{currentTrack?.artist}</p>
              </div>

              <div className="mt-8">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={progress}
                  onChange={handleSeek}
                  className="w-full accent-yellow-300 bg-gray-300 dark:bg-gray-600 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-white mt-2">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex justify-center items-center space-x-8 mt-8">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(toggleShuffle())}
                  className={`text-white ${shuffleMode ? 'text-yellow-300' : ''}`}
                >
                  <ArrowsRightLeftIcon className="h-6 w-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(previousTrack())}
                  className="text-white"
                >
                  <ChevronLeftIcon className="h-8 w-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(togglePlay())}
                  className="bg-white text-purple-600 rounded-full p-4 hover:bg-yellow-300 hover:text-purple-700 transition-colors shadow-lg"
                >
                  {isPlaying ? (
                    <PauseIcon className="h-10 w-10" />
                  ) : (
                    <PlayIcon className="h-10 w-10" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(nextTrack())}
                  className="text-white"
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(toggleRepeat())}
                  className={`text-white ${repeatMode ? 'text-yellow-300' : ''}`}
                >
                  <ArrowPathRoundedSquareIcon className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Lyrics</h3>
                <div className="text-gray-200 text-center">
                  {lyrics.map((line, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: index === currentLyricIndex ? 1 : 0.5, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={index === currentLyricIndex ? 'text-yellow-300' : ''}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Queue</h3>
                <div className="space-y-2">
                  {queue.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center bg-white bg-opacity-10 rounded-lg p-2"
                    >
                      <img src={track.albumCover} alt={track.title} className="w-10 h-10 rounded-md mr-3" />
                      <div>
                        <p className="text-white font-semibold">{track.title}</p>
                        <p className="text-gray-300 text-sm">{track.artist}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <SpeakerWaveIcon className="h-5 w-5 text-white mr-2" />
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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white"
          >
            <QueueListIcon className="h-6 w-6" />
          </motion.button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </motion.div>
  );
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default Player;