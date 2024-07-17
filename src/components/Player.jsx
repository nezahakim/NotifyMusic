import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
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
  XMarkIcon,
  ChevronDownIcon,
  HeartIcon,
  ShareIcon,
  MicrophoneIcon,
  MusicalNoteIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  BookmarkIcon,
  FireIcon,
} from "@heroicons/react/24/solid";
import {
  setProgress,
  setDuration,
  togglePlay,
  setVolume,
  skipTrack,
  toggleShuffle,
  toggleRepeat,
  addToQueue,
  removeFromQueue,
  toggleRadioMode,
  setEqualizer,
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
    equalizer,
    radioMode,
  } = useSelector((state) => state.player);

  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("upNext");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(null);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [lyrics, setLyrics] = useState([]);
  const [relatedTracks, setRelatedTracks] = useState([]);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationControls = useAnimation();

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      animationControls.start({
        rotate: 360,
        transition: { duration: 10, repeat: Infinity, ease: "linear" },
      });
    } else {
      audioRef.current.pause();
      animationControls.stop();
    }
  }, [isPlaying, currentTrack, animationControls]);

  useEffect(() => {
    if (currentTrack) {
      // Simulating API calls for lyrics and related tracks
      setTimeout(() => {
        setLyrics([
          "This is the first line of lyrics",
          "Here's the second line",
          "And the third line goes here",
          // ... more lyrics
        ]);
      }, 1000);

      setTimeout(() => {
        setRelatedTracks([
          { id: 1, title: "Related Track 1", artist: "Artist 1" },
          { id: 2, title: "Related Track 2", artist: "Artist 2" },
          { id: 3, title: "Related Track 3", artist: "Artist 3" },
          // ... more related tracks
        ]);
      }, 1500);
    }
  }, [currentTrack]);

  const handleTimeUpdate = useCallback(() => {
    dispatch(setProgress(audioRef.current.currentTime));
  }, [dispatch]);

  const handleLoadedMetadata = useCallback(() => {
    dispatch(setDuration(audioRef.current.duration));
  }, [dispatch]);

  const handleVolumeChange = useCallback(
    (e) => {
      const newVolume = parseFloat(e.target.value);
      dispatch(setVolume(newVolume));
      audioRef.current.volume = newVolume;
    },
    [dispatch],
  );

  const handleSeek = useCallback(
    (e) => {
      const time = parseFloat(e.target.value);
      dispatch(setProgress(time));
      audioRef.current.currentTime = time;
    },
    [dispatch],
  );

  const handleLike = useCallback(() => {
    setLiked(!liked);
    setDisliked(false);
    // TODO: Implement API call to save like status
  }, [liked]);

  const handleDislike = useCallback(() => {
    setDisliked(!disliked);
    setLiked(false);
    // TODO: Implement API call to save dislike status
  }, [disliked]);

  const handleSleepTimer = useCallback(
    (minutes) => {
      if (sleepTimer) {
        clearTimeout(sleepTimer);
      }
      const timer = setTimeout(
        () => {
          dispatch(togglePlay(false));
          setSleepTimer(null);
        },
        minutes * 60 * 1000,
      );
      setSleepTimer(timer);
    },
    [dispatch, sleepTimer],
  );

  const handleEqualizerChange = useCallback(
    (band, value) => {
      dispatch(setEqualizer({ ...equalizer, [band]: value }));
      // TODO: Apply equalizer settings to audio
    },
    [dispatch, equalizer],
  );

  const toggleRadio = useCallback(() => {
    dispatch(toggleRadioMode());
    // TODO: Implement radio mode logic
  }, [dispatch]);

  const handlers = useSwipeable({
    onSwipedUp: () => setExpanded(true),
    onSwipedDown: () => setExpanded(false),
    onSwipedLeft: () => dispatch(skipTrack("next")),
    onSwipedRight: () => dispatch(skipTrack("prev")),
  });

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <motion.div
        {...handlers}
        initial={false}
        animate={{ height: expanded ? "100vh" : "6rem" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-gray-900 to-black text-white"
      >
        <div className="container mx-auto px-4 h-full flex flex-col">
          {/* Minimized Player */}
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center">
              <motion.img
                src={
                  currentTrack?.albumCover || "https://via.placeholder.com/50"
                }
                alt="Album Cover"
                className="w-16 h-16 rounded-full mr-4 shadow-lg"
                animate={animationControls}
              />
              <div>
                <h3 className="font-bold text-white text-shadow">
                  {currentTrack?.title || "No track selected"}
                </h3>
                <p className="text-sm text-gray-300">{currentTrack?.artist}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(togglePlay())}
                className="bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors shadow-lg"
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setExpanded(!expanded)}
                className="text-white"
              >
                {expanded ? (
                  <ChevronDownIcon className="h-6 w-6" />
                ) : (
                  <ChevronRightIcon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Expanded Player */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col"
              >
                <div className="flex-grow flex flex-col items-center justify-center">
                  <motion.img
                    src={
                      currentTrack?.albumCover ||
                      "https://via.placeholder.com/300"
                    }
                    alt="Album Cover"
                    className="w-64 h-64 rounded-lg shadow-2xl mb-8"
                    animate={animationControls}
                  />
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {currentTrack?.title}
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    {currentTrack?.artist}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full max-w-md flex items-center mb-4">
                    <span className="text-sm mr-2 text-white">
                      {formatTime(progress)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={progress}
                      onChange={handleSeek}
                      className="w-full accent-red-500 bg-gray-700 h-2 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm ml-2 text-white">
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Control buttons */}
                  <div className="flex items-center space-x-8 mb-8">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLike}
                      className={`${liked ? "text-red-500" : "text-white"}`}
                    >
                      <HeartIcon className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(skipTrack("prev"))}
                      className="text-white"
                    >
                      <ChevronLeftIcon className="h-8 w-8" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(togglePlay())}
                      className="bg-red-500 text-white rounded-full p-4 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      {isPlaying ? (
                        <PauseIcon className="h-8 w-8" />
                      ) : (
                        <PlayIcon className="h-8 w-8" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(skipTrack("next"))}
                      className="text-white"
                    >
                      <ChevronRightIcon className="h-8 w-8" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDislike}
                      className={`${disliked ? "text-red-500" : "text-white"}`}
                    >
                      <HeartIcon className="h-6 w-6" />
                    </motion.button>
                  </div>

                  {/* Additional controls */}
                  <div className="flex items-center space-x-8">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(toggleShuffle())}
                      className={`${shuffle ? "text-red-500" : "text-white"}`}
                    >
                      <ArrowsRightLeftIcon className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(toggleRepeat())}
                      className={`${repeat ? "text-red-500" : "text-white"}`}
                    >
                      <ArrowPathRoundedSquareIcon className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white"
                      onClick={() => setShowEqualizer(!showEqualizer)}
                    >
                      <AdjustmentsHorizontalIcon className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white"
                      onClick={() => handleSleepTimer(30)}
                    >
                      <ClockIcon className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`${radioMode ? "text-red-500" : "text-white"}`}
                      onClick={toggleRadio}
                    >
                      <SparklesIcon className="h-6 w-6" />
                    </motion.button>
                  </div>

                  {/* Equalizer */}
                  {showEqualizer && (
                    <div className="mt-4 w-full max-w-md">
                      <h3 className="text-white mb-2">Equalizer</h3>
                      <div className="flex justify-between">
                        {["bass", "mid", "treble"].map((band) => (
                          <div
                            key={band}
                            className="flex flex-col items-center"
                          >
                            <input
                              type="range"
                              min="-12"
                              max="12"
                              value={equalizer[band]}
                              onChange={(e) =>
                                handleEqualizerChange(band, e.target.value)
                              }
                              className="w-16 h-32 appearance-none bg-gray-700 rounded-full overflow-hidden accent-red-500"
                              orient="vertical"
                            />
                            <span className="text-white mt-2">{band}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="mt-8">
                  <div className="flex justify-center space-x-4 mb-4">
                    <button
                      className={`text-white ${activeTab === "upNext" ? "border-b-2 border-red-500" : ""}`}
                      onClick={() => setActiveTab("upNext")}
                    >
                      Up Next
                    </button>
                    <button
                      className={`text-white ${activeTab === "lyrics" ? "border-b-2 border-red-500" : ""}`}
                      onClick={() => setActiveTab("lyrics")}
                    >
                      Lyrics
                    </button>
                    <button
                      className={`text-white ${activeTab === "relatedTracks" ? "border-b-2 border-red-500" : ""}`}
                      onClick={() => setActiveTab("relatedTracks")}
                    >
                      Related
                    </button>
                  </div>

                  {activeTab === "upNext" && (
                    <div className="text-white h-48 overflow-y-auto">
                      {queue.map((track, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex justify-between items-center mb-2 bg-gray-800 rounded-lg p-2"
                        >
                          <div className="flex items-center">
                            <img
                              src={track.albumCover}
                              alt={track.title}
                              className="w-10 h-10 rounded-md mr-3"
                            />
                            <div>
                              <span className="font-semibold">
                                {track.title}
                              </span>
                              <p className="text-sm text-gray-400">
                                {track.artist}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromQueue(track.id))}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === "lyrics" && (
                    <div className="text-white text-center h-48 overflow-y-auto">
                      {lyrics.map((line, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="mb-2"
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>
                  )}

                  {activeTab === "relatedTracks" && (
                    <div className="text-white h-48 overflow-y-auto">
                      {relatedTracks.map((track, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex justify-between items-center mb-2 bg-gray-800 rounded-lg p-2"
                        >
                          <div className="flex items-center">
                            <img
                              src={
                                track.albumCover ||
                                "https://via.placeholder.com/40"
                              }
                              alt={track.title}
                              className="w-10 h-10 rounded-md mr-3"
                            />
                            <div>
                              <span className="font-semibold">
                                {track.title}
                              </span>
                              <p className="text-sm text-gray-400">
                                {track.artist}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => dispatch(addToQueue(track))}
                            className="text-green-500 hover:text-green-400 transition-colors"
                          >
                            <QueueListIcon className="h-5 w-5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Volume Control */}
          <div className="flex items-center justify-end h-16 mt-4">
            <SpeakerWaveIcon className="h-5 w-5 text-white mr-2" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-red-500 bg-gray-700 h-2 rounded-lg appearance-none cursor-pointer"
            />
          </div>
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
