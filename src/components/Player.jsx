// src/components/Player.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  PlayIcon,
  PauseIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SpeakerWaveIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
  QueueListIcon,
  XMarkIcon,
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
  addToQueue,
  removeFromQueue,
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
    shuffle,
    repeat,
  } = useSelector((state) => state.player);
  const [expanded, setExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef(null);
  const dragControls = useDragControls();

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

  const handleNext = () => {
    dispatch(nextTrack());
  };

  const handlePrevious = () => {
    dispatch(previousTrack());
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    onSwipedDown: () => setExpanded(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const playlist = [
    { id: 1, title: "Song 1", artist: "Artist 1" },
    { id: 2, title: "Song 2", artist: "Artist 2" },
    { id: 3, title: "Song 3", artist: "Artist 3" },
  ];

  const mockLyrics =
    "This is a sample lyric line\nIt goes on and on\nUntil the song is done";

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: expanded ? 0 : "100%", opacity: 1 }}
        transition={{ duration: 0.5 }}
        drag="y"
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 50) {
            setExpanded(false);
          }
        }}
        className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 ${
          expanded ? "h-screen" : "h-20"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="container mx-auto px-4 h-full flex flex-col">
          {!expanded && (
            <div
              className="flex items-center justify-between h-20"
              {...handlers}
            >
              <div className="flex items-center">
                <img
                  src={
                    currentTrack?.albumCover || "https://via.placeholder.com/50"
                  }
                  alt="Album Cover"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-bold text-white">
                    {currentTrack?.title || "No track selected"}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {currentTrack?.artist}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => dispatch(togglePlay())}
                  className="text-white"
                >
                  {isPlaying ? (
                    <PauseIcon className="h-8 w-8" />
                  ) : (
                    <PlayIcon className="h-8 w-8" />
                  )}
                </button>
                <button
                  onClick={() => setExpanded(true)}
                  className="text-white"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}

          {expanded && (
            <div className="flex-1 flex flex-col pt-8" {...handlers}>
              <button
                onClick={() => setExpanded(false)}
                className="self-end text-white mb-4"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <div className="flex-1 flex flex-col items-center justify-center">
                <motion.img
                  src={
                    currentTrack?.albumCover ||
                    "https://via.placeholder.com/300"
                  }
                  alt="Album Cover"
                  className="w-64 h-64 rounded-lg shadow-lg mb-8"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentTrack?.title || "No track selected"}
                </h2>
                <p className="text-xl text-gray-200 mb-8">
                  {currentTrack?.artist}
                </p>
                <div className="w-full max-w-md flex items-center mb-8">
                  <span className="text-sm text-white mr-2">
                    {formatTime(progress)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full accent-white"
                  />
                  <span className="text-sm text-white ml-2">
                    {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center space-x-8">
                  <button
                    onClick={() => dispatch(toggleShuffle())}
                    className={`text-white ${shuffle ? "opacity-100" : "opacity-50"}`}
                  >
                    <ArrowsRightLeftIcon className="h-6 w-6" />
                  </button>
                  <button onClick={handlePrevious} className="text-white">
                    <ChevronLeftIcon className="h-8 w-8" />
                  </button>
                  <button
                    onClick={() => dispatch(togglePlay())}
                    className="bg-white text-purple-600 rounded-full p-4"
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-8 w-8" />
                    ) : (
                      <PlayIcon className="h-8 w-8" />
                    )}
                  </button>
                  <button onClick={handleNext} className="text-white">
                    <ChevronRightIcon className="h-8 w-8" />
                  </button>
                  <button
                    onClick={() => dispatch(toggleRepeat())}
                    className={`text-white ${repeat ? "opacity-100" : "opacity-50"}`}
                  >
                    <ArrowPathIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="mt-auto mb-4">
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className="text-white mb-2"
                >
                  <QueueListIcon className="h-6 w-6" />
                </button>
                {showPlaylist ? (
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 max-h-40 overflow-y-auto">
                    {playlist.map((track) => (
                      <div
                        key={track.id}
                        className="flex justify-between items-center mb-2"
                      >
                        <div>
                          <p className="text-white font-semibold">
                            {track.title}
                          </p>
                          <p className="text-gray-300 text-sm">
                            {track.artist}
                          </p>
                        </div>
                        <button
                          onClick={() => dispatch(addToQueue(track))}
                          className="text-white"
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white text-center">
                    {mockLyrics.split("\n").map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default Player;
