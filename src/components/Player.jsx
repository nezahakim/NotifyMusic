import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-js";
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
  const [accessToken, setAccessToken] = useState("");
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const fetchQueue = useCallback(async () => {
    try {
      const playlist = await spotifyApi.getPlaylist("37i9dQZEVXbMDoHDwVN2tF"); // Example playlist ID (Global Top 50)
      const tracks = playlist.tracks.items.map((item) => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        albumCover: item.track.album.images[0].url,
        audioUrl: item.track.preview_url,
      }));
      setPlaylist(tracks);
      setQueue(tracks.slice(1, 11)); // Set the next 10 tracks as the queue
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  }, []);

  const [isAudioOperationInProgress, setIsAudioOperationInProgress] =
    useState(false);

  const togglePlay = useCallback(() => {
    if (audioRef.current && !isAudioOperationInProgress) {
      setIsAudioOperationInProgress(true);
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsAudioOperationInProgress(false);
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
          })
          .finally(() => {
            setIsAudioOperationInProgress(false);
          });
      }
    }
  }, [isPlaying, isAudioOperationInProgress]);

  const handleNextTrack = useCallback(() => {
    if (
      currentTrackIndex < playlist.length - 1 &&
      !isAudioOperationInProgress
    ) {
      setIsAudioOperationInProgress(true);
      setCurrentTrackIndex((prevIndex) => prevIndex + 1);
      setCurrentTrack(playlist[currentTrackIndex + 1]);
      setIsPlaying(true);
      setIsAudioOperationInProgress(false);
    }
  }, [currentTrackIndex, playlist, isAudioOperationInProgress]);

  const handlePreviousTrack = useCallback(() => {
    if (currentTrackIndex > 0 && !isAudioOperationInProgress) {
      setIsAudioOperationInProgress(true);
      setCurrentTrackIndex((prevIndex) => prevIndex - 1);
      setCurrentTrack(playlist[currentTrackIndex - 1]);
      setIsPlaying(true);
      setIsAudioOperationInProgress(false);
    }
  }, [currentTrackIndex, playlist, isAudioOperationInProgress]);

  const fetchCurrentTrack = useCallback(async () => {
    if (playlist.length > 0) {
      setCurrentTrack(playlist[currentTrackIndex]);
    }
  }, [playlist, currentTrackIndex]);

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
    const getAccessToken = async () => {
      const clientId = "44e86430da7d4bd7ae36d59f81aff51e";
      const clientSecret = "52dc1ffae8724a98a73dd92b1123074f";
      try {
        const result = await axios.post(
          "https://accounts.spotify.com/api/token",
          `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );
        setAccessToken(result.data.access_token);
        spotifyApi.setAccessToken(result.data.access_token);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchCurrentTrack();
      fetchQueue();
    }
  }, [accessToken, fetchCurrentTrack, fetchQueue]);

  useEffect(() => {
    if (audioRef.current && currentTrack && currentTrack.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current && !isAudioOperationInProgress) {
      setIsAudioOperationInProgress(true);
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => {
            console.error("Error in play effect:", error);
            setIsPlaying(false);
          })
          .finally(() => {
            setIsAudioOperationInProgress(false);
          });
      } else {
        audioRef.current.pause();
        setIsAudioOperationInProgress(false);
      }
    }
  }, [isPlaying]);

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
      if (
        audioRef.current &&
        !isNaN(duration) &&
        duration > 0 &&
        !isAudioOperationInProgress
      ) {
        setIsAudioOperationInProgress(true);
        const newTime = (newProgress / 100) * duration;
        audioRef.current.currentTime = newTime;
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
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      setIsPlaying(true);
    }
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
                value={isNaN(progress) ? 0 : progress}
                onChange={handleProgressChange}
                onMouseDown={handleProgressMouseDown}
                onMouseUp={handleProgressMouseUp}
                onTouchStart={handleProgressMouseDown}
                onTouchEnd={handleProgressMouseUp}
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
                onClick={() => (audioRef.current.currentTime -= 10)}
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
                onClick={() => (audioRef.current.currentTime += 10)}
                className="text-gray-400 hover:text-white"
              >
                <ForwardIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-4 space-x-8">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className="text-sm flex items-center space-x-1 hover:text-pink-400 transition-colors"
          >
            <MicrophoneIcon className="h-4 w-4" />
            <span>Lyrics</span>
          </button>
          <button
            onClick={() => setShowQueue(!showQueue)}
            className="text-sm flex items-center space-x-1 hover:text-blue-400 transition-colors"
          >
            <QueueListIcon className="h-4 w-4" />
            <span>Queue</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showLyrics && (
          <LyricsModal
            lyrics="Lyrics not available"
            onClose={() => setShowLyrics(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQueue && (
          <QueueModal
            queue={queue}
            onClose={() => setShowQueue(false)}
            onPlayTrack={playTrackFromQueue}
          />
        )}
      </AnimatePresence>

      {currentTrack && (
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={() => setIsAudioOperationInProgress(false)}
        onError={(e) => {
          console.error("Audio error:", e);
          setIsPlaying(false);
          setIsAudioOperationInProgress(false);
        }}
      />

      )}
    </motion.div>
  );
};

const LyricsModal = ({ lyrics, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className="fixed inset-0 bg-black bg-opacity-75 backdrop-filter backdrop-blur-sm flex items-center justify-center"
  >
    <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Lyrics</h2>
      <p className="whitespace-pre-line">{lyrics}</p>
      <button
        onClick={onClose}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
      >
        Close
      </button>
    </div>
  </motion.div>
);

const QueueModal = ({ queue, onClose, onPlayTrack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Up Next</h2>
        <ul>
          {queue.map((track, index) => (
            <li
              key={track.id}
              className="flex items-center space-x-4 mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => onPlayTrack(index)}
            >
              <img
                src={track.coverUrl}
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
          className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default Player;
