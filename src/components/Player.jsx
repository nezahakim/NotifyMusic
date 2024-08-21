// Player.js

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  getSpotifyAccessToken,
  fetchSpotifyPlaylist,
  fetchYouTubeVideo,
  fetchLyrics,
} from "./api";
import {
  cacheTrack,
  getCachedTrack,
  prefetchNextTracks,
} from "./cachingService";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

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
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState("");
  const [isAudioOperationInProgress, setIsAudioOperationInProgress] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const playerRef = useRef(null);
  const currentVideoIdRef = useRef(null);

  const fetchQueue = useCallback(async () => {
    try {
      const tracks = await fetchSpotifyPlaylist("37i9dQZEVXbMDoHDwVN2tF"); // Example playlist ID (Global Top 50)
      setPlaylist(tracks);
      setQueue(tracks.slice(1, 11)); // Set the next 10 tracks as the queue
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  }, []);

  const loadAndPlayVideo = useCallback(async (track) => {
    setIsLoading(true);
    const youtubeVideo = await fetchYouTubeVideo(track.title, track.artist);
    if (youtubeVideo && youtubeVideo.videoId !== currentVideoIdRef.current) {
      currentVideoIdRef.current = youtubeVideo.videoId;
      const updatedTrack = { ...track, ...youtubeVideo };
      setCurrentTrack(updatedTrack);
      if (playerRef.current) {
        playerRef.current.loadVideoById(youtubeVideo.videoId);
        setIsPlaying(true);
      } else {
        loadVideo(youtubeVideo.videoId);
      }
    }
    setIsLoading(false);
  }, []);

  const handleNextTrack = useCallback(() => {
    if (
      currentTrackIndex < playlist.length - 1 &&
      !isAudioOperationInProgress
    ) {
      setIsAudioOperationInProgress(true);
      const nextIndex = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIndex);
      loadAndPlayVideo(playlist[nextIndex]);
      setIsAudioOperationInProgress(false);
    }
  }, [
    currentTrackIndex,
    playlist,
    isAudioOperationInProgress,
    loadAndPlayVideo,
  ]);

  const handlePreviousTrack = useCallback(() => {
    if (currentTrackIndex > 0 && !isAudioOperationInProgress) {
      setIsAudioOperationInProgress(true);
      const prevIndex = currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      loadAndPlayVideo(playlist[prevIndex]);
      setIsAudioOperationInProgress(false);
    }
  }, [
    currentTrackIndex,
    playlist,
    isAudioOperationInProgress,
    loadAndPlayVideo,
  ]);

  const playTrackFromQueue = useCallback(
    (index) => {
      const newIndex = currentTrackIndex + index + 1;
      if (newIndex < playlist.length) {
        setCurrentTrackIndex(newIndex);
        loadAndPlayVideo(playlist[newIndex]);
      }
    },
    [currentTrackIndex, playlist, loadAndPlayVideo],
  );

  const togglePlay = useCallback(() => {
    if (playerRef.current && !isAudioOperationInProgress) {
      setIsAudioOperationInProgress(true);
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
      setIsAudioOperationInProgress(false);
    }
  }, [isPlaying, isAudioOperationInProgress]);

  const fetchCurrentTrack = useCallback(async () => {
    if (playlist.length > 0) {
      const track = playlist[currentTrackIndex];
      setCurrentTrack(track);
      await loadAndPlayVideo(track);
    }
  }, [playlist, currentTrackIndex, loadAndPlayVideo]);

  useEffect(() => {
    const initializePlayer = async () => {
      const accessToken = await getSpotifyAccessToken();
      spotifyApi.setAccessToken(accessToken);
      await fetchQueue();
    };
    initializePlayer();
  }, [fetchQueue]);

  useEffect(() => {
    if (!currentTrack) {
      fetchCurrentTrack();
    }
  }, [currentTrack, fetchCurrentTrack]);

  const loadVideo = (videoId) => {
    if (window.YT) {
      new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            setIsPlaying(true);
            setIsLoading(false);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              handleNextTrack();
            }
          },
        },
      });
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => loadVideo(videoId);
    }
  };

  useEffect(() => {
    if (
      currentTrack &&
      currentTrack.videoId &&
      currentTrack.videoId !== currentVideoIdRef.current
    ) {
      loadAndPlayVideo(currentTrack);
    }
  }, [currentTrack, loadAndPlayVideo]);

  const handleTimeUpdate = useCallback(() => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      const newProgress = (currentTime / duration) * 100;
      setProgress(isNaN(newProgress) ? 0 : newProgress);
      setDuration(duration);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(handleTimeUpdate, 1000);
    return () => clearInterval(interval);
  }, [handleTimeUpdate]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume * 100);
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => !prev);
    // Implement shuffle logic here
  }, []);

  const toggleRepeat = useCallback(() => {
    const modes = ["off", "track", "context"];
    setRepeatMode((prev) => modes[(modes.indexOf(prev) + 1) % modes.length]);
    // Implement repeat logic here
  }, []);

  const handleLike = useCallback(() => {
    console.log("Liked!");
    // Implement like functionality here
  }, []);

  const handleShare = useCallback(() => {
    console.log("Shared!");
    // Implement share functionality here
  }, []);

  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  const handleProgressChange = useCallback(
    (e) => {
      const newProgress = parseFloat(e.target.value);
      if (
        playerRef.current &&
        !isNaN(duration) &&
        duration > 0 &&
        !isAudioOperationInProgress
      ) {
        setIsAudioOperationInProgress(true);
        const newTime = (newProgress / 100) * duration;
        playerRef.current.seekTo(newTime);
        setProgress(newProgress);
        setIsAudioOperationInProgress(false);
      }
    },
    [duration, isAudioOperationInProgress],
  );

  const handleProgressMouseDown = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleProgressMouseUp = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, []);

  const handleShowLyrics = useCallback(async () => {
    if (!showLyrics && currentTrack) {
      const fetchedLyrics = await fetchLyrics(
        currentTrack.title,
        currentTrack.artist,
      );
      setLyrics(fetchedLyrics);
    }
    setShowLyrics((prev) => !prev);
    setShowQueue(false);
  }, [showLyrics, currentTrack]);

  const handleShowQueue = useCallback(() => {
    setShowQueue((prev) => !prev);
    setShowLyrics(false);
  }, []);

  if (!currentTrack) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      className={`fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-filter backdrop-blur-lg text-white p-4 ${
        isExpanded ? "h-screen" : ""
      }`}
      animate={{ height: isExpanded ? "100vh" : "auto" }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto max-w-6xl h-full flex flex-col">
        {isExpanded ? (
          // Expanded view
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleExpand}
                className="text-gray-400 hover:text-white"
              >
                <ChevronDownIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center space-y-8">
              <img
                src={currentTrack.albumCover}
                alt="Album Cover"
                className="w-64 h-64 rounded-lg shadow-lg"
              />
              <div className="text-center">
                <h3 className="text-3xl font-bold">{currentTrack.title}</h3>
                <p className="text-xl text-gray-300">{currentTrack.artist}</p>
                <p className="text-sm text-gray-400">{currentTrack.album}</p>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm text-gray-400">
                  {formatTime(playerRef.current?.getCurrentTime() || 0)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isNaN(progress) ? 0 : progress}
                  onChange={handleProgressChange}
                  onMouseDown={handleProgressMouseDown}
                  onMouseUp={handleProgressMouseUp}
                  onTouchStart={handleProgressMouseDown}
                  onTouchEnd={handleProgressMouseUp}
                  className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden appearance-none"
                />
                <span className="text-sm text-gray-400">
                  {formatTime(playerRef.current?.getDuration() || 0)}
                </span>
              </div>
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
          </>
        ) : (
          // Minimized view
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={currentTrack.albumCover}
                  alt="Album Cover"
                  className="rounded-lg shadow-lg w-32 h-32"
                />
                <div>
                  <h3 className="font-bold text-2xl">{currentTrack.title}</h3>
                  <p className="text-base text-gray-300">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleExpand}
                className="text-gray-400 hover:text-white"
              >
                <ChevronUpIcon className="h-6 w-6" />
              </button>
            </div>
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
                  {formatTime(playerRef.current?.getCurrentTime() || 0)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isNaN(progress) ? 0 : progress}
                  onChange={handleProgressChange}
                  onMouseDown={handleProgressMouseDown}
                  onMouseUp={handleProgressMouseUp}
                  onTouchStart={handleProgressMouseDown}
                  onTouchEnd={handleProgressMouseUp}
                  className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden appearance-none"
                />
                <span className="text-sm text-gray-400">
                  {formatTime(playerRef.current?.getDuration() || 0)}
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
          </>
        )}

        <div className="flex justify-center mt-4 space-x-8">
          <button
            onClick={handleShowLyrics}
            className="text-sm flex items-center space-x-1 hover:text-pink-400 transition-colors"
          >
            <MicrophoneIcon className="h-4 w-4" />
            <span>Lyrics</span>
          </button>
          <button
            onClick={handleShowQueue}
            className="text-sm flex items-center space-x-1 hover:text-blue-400 transition-colors"
          >
            <QueueListIcon className="h-4 w-4" />
            <span>Queue</span>
          </button>
        </div>

        <AnimatePresence>
          {showLyrics && (
            <LyricsPanel lyrics={lyrics} onClose={() => setShowLyrics(false)} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showQueue && (
            <QueuePanel
              queue={queue}
              onClose={() => setShowQueue(false)}
              onPlayTrack={playTrackFromQueue}
            />
          )}
        </AnimatePresence>
      </div>
      <div id="youtube-player" style={{ display: "none" }}></div>
    </motion.div>
  );
};

const LyricsPanel = ({ lyrics, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className="bottom-full left-0 right-0 bg-gray-900 p-6 rounded-t-lg max-h-[50vh] overflow-y-auto"
  >
    <h2 className="text-2xl font-bold mb-4">Lyrics</h2>
    <p className="whitespace-pre-line">{lyrics}</p>
    <button
      onClick={onClose}
      className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
    >
      Close
    </button>
  </motion.div>
);

const QueuePanel = ({ queue, onClose, onPlayTrack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="bottom-full left-0 right-0 bg-gray-900 p-6 rounded-t-lg max-h-[50vh] overflow-y-auto"
    >
      <h2 className="text-2xl font-bold mb-4">Up Next</h2>
      <ul>
        {queue.map((track, index) => (
          <li
            key={track.id}
            className="flex items-center space-x-4 mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={() => onPlayTrack(index)}
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
      <button
        onClick={onClose}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Close
      </button>
    </motion.div>
  );
};

export default Player;
