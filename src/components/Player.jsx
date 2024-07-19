// Player.js

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPlaylist, fetchLyrics, getTrackInfo } from "./lastfmApi";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ShareIcon,
  MicrophoneIcon,
  QueueListIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  ForwardIcon,
  BackwardIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState("");

  const audioRef = useRef(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const fetchQueueAndCurrentTrack = useCallback(async () => {
    try {
      const fetchedPlaylist = await fetchPlaylist();
      setPlaylist(fetchedPlaylist);
      setQueue(fetchedPlaylist.slice(1, 11));
      setCurrentTrack(fetchedPlaylist[0]);
    } catch (error) {
      console.error("Error fetching queue and current track:", error);
    }
  }, []);

  useEffect(() => {
    fetchQueueAndCurrentTrack();
  }, [fetchQueueAndCurrentTrack]);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleNextTrack = useCallback(() => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex((prevIndex) => prevIndex + 1);
      setCurrentTrack(playlist[currentTrackIndex + 1]);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, playlist]);

  const handlePreviousTrack = useCallback(() => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prevIndex) => prevIndex - 1);
      setCurrentTrack(playlist[currentTrackIndex - 1]);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, playlist]);

  const playTrackFromQueue = useCallback(
    (index) => {
      const newIndex = currentTrackIndex + index + 1;
      if (newIndex < playlist.length) {
        setCurrentTrackIndex(newIndex);
        setCurrentTrack(playlist[newIndex]);
        setIsPlaying(true);
      }
    },
    [currentTrackIndex, playlist],
  );

  useEffect(() => {
    if (audioRef.current && currentTrack && currentTrack.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const newProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(newProgress) ? 0 : newProgress);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const toggleShuffle = useCallback(
    () => setIsShuffled(!isShuffled),
    [isShuffled],
  );

  const toggleRepeat = useCallback(() => {
    const modes = ["off", "track", "context"];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  }, [repeatMode]);

  const handleLike = useCallback(() => console.log("Liked!"), []);
  const handleShare = useCallback(() => console.log("Shared!"), []);

  const toggleExpand = useCallback(
    () => setIsExpanded(!isExpanded),
    [isExpanded],
  );

  const handleProgressChange = useCallback(
    (e) => {
      const newProgress = parseFloat(e.target.value);
      if (audioRef.current && !isNaN(duration) && duration > 0) {
        const newTime = (newProgress / 100) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(newProgress);
      }
    },
    [duration],
  );

  const toggleLyrics = useCallback(async () => {
    if (!showLyrics && currentTrack) {
      const fetchedLyrics = await fetchLyrics(currentTrack.id);
      setLyrics(fetchedLyrics);
    }
    setShowLyrics(!showLyrics);
    setShowQueue(false);
  }, [showLyrics, currentTrack]);

  const toggleQueue = useCallback(() => {
    setShowQueue(!showQueue);
    setShowLyrics(false);
  }, [showQueue]);

  if (!currentTrack) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      className={`fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-filter backdrop-blur-lg text-white p-4`}
      animate={{
        height: isExpanded
          ? showLyrics || showQueue
            ? "100vh"
            : "auto"
          : "auto",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentTrack.albumCover}
              alt="Album Cover"
              className={`rounded-lg shadow-lg ${isExpanded ? "w-32 h-32" : "w-16 h-16"}`}
            />
            <div>
              <h3
                className={`font-bold ${isExpanded ? "text-2xl" : "text-lg"}`}
              >
                {currentTrack.title}
              </h3>
              <p
                className={`${isExpanded ? "text-base" : "text-sm"} text-gray-300`}
              >
                {currentTrack.artist}
              </p>
              {isExpanded && (
                <p className="text-sm text-gray-400">{currentTrack.album}</p>
              )}
            </div>
          </div>
          <button
            onClick={toggleExpand}
            className="text-gray-400 hover:text-white"
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-6 w-6" />
            ) : (
              <ChevronUpIcon className="h-6 w-6" />
            )}
          </button>
        </div>
        {isExpanded && (
          <div className="mb-8">
            <div className="flex justify-center space-x-8 mb-6">
              <button
                onClick={toggleShuffle}
                className={`text-gray-400 hover:text-white ${isShuffled ? "text-green-500" : ""}`}
              >
                <ArrowsRightLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handlePreviousTrack}
                className="text-gray-400 hover:text-white"
              >
                <BackwardIcon className="h-6 w-6" />
              </button>
              <button
                onClick={togglePlay}
                className="bg-white text-black rounded-full p-4 hover:bg-gray-200 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="h-8 w-8" />
                ) : (
                  <PlayIcon className="h-8 w-8" />
                )}
              </button>
              <button
                onClick={handleNextTrack}
                className="text-gray-400 hover:text-white"
              >
                <ForwardIcon className="h-6 w-6" />
              </button>
              <button
                onClick={toggleRepeat}
                className={`text-gray-400 hover:text-white ${repeatMode !== "off" ? "text-green-500" : ""}`}
              >
                <ArrowPathRoundedSquareIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm text-gray-400">
                {formatTime(audioRef.current?.currentTime || 0)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden appearance-none"
              />
              <span className="text-sm text-gray-400">
                {formatTime(audioRef.current?.duration || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <HeartIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={handleShare}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <ShareIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Volume</span>
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
          </div>
        )}
        {!isExpanded && (
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="flex-grow h-1 bg-gray-700 rounded-full overflow-hidden appearance-none"
            />
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePreviousTrack}
                className="text-gray-400 hover:text-white"
              >
                <BackwardIcon className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlay}
                className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="h-5 w-5" />
                ) : (
                  <PlayIcon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={handleNextTrack}
                className="text-gray-400 hover:text-white"
              >
                <ForwardIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-center mt-4 space-x-8">
          <button
            onClick={toggleLyrics}
            className="text-sm flex items-center space-x-1 hover:text-pink-400 transition-colors"
          >
            <MicrophoneIcon className="h-4 w-4" />
            <span>Lyrics</span>
          </button>
          <button
            onClick={toggleQueue}
            className="text-sm flex items-center space-x-1 hover:text-blue-400 transition-colors"
          >
            <QueueListIcon className="h-4 w-4" />
            <span>Queue</span>
          </button>
        </div>
      </div>
      {showLyrics && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg max-h-[50vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Lyrics</h2>
          <p className="whitespace-pre-line">{lyrics}</p>
        </div>
      )}
      {showQueue && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg max-h-[50vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Up Next</h2>
          <ul>
            {queue.map((track, index) => (
              <li
                key={track.id}
                className="flex items-center space-x-4 mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded"
                onClick={() => playTrackFromQueue(index)}
              >
                <img
                  src={track.albumCover}
                  alt={track.title}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="font-semibold">{track.title}</p>
                  <p className="text-sm text-gray-400">{track.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleNextTrack}
        />
      )}
    </motion.div>
  );
};

export default Player;
