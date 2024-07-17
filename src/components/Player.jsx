import React, { useState, useRef, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState("visualizer");
  const [liked, setLiked] = useState(false);
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
    if (activeTab === "visualizer" && canvasRef.current) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      function animate() {
        requestAnimationFrame(animate);
        const frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let angle = 0;
        const angleIncrement = (Math.PI * 2) / frequencyData.length;

        for (let i = 0; i < frequencyData.length; i++) {
          const height = frequencyData[i] * 0.7;
          const radius = 100 + height;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `hsl(${i}, 100%, 50%)`;
          ctx.lineWidth = 2;
          ctx.stroke();

          angle += angleIncrement;
        }
      }

      animate();

      return () => {
        source.disconnect();
        analyser.disconnect();
        audioContext.close();
      };
    }
  }, [activeTab]);

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
    onSwipedLeft: () => dispatch(skipTrack("next")),
    onSwipedRight: () => dispatch(skipTrack("prev")),
  });

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const lyrics = [
    "This is the first line of the lyrics",
    "Here comes the second line",
    "And the third line follows",
    // ... more lines
  ];

  return (
    <>
      <motion.div
        {...handlers}
        initial={false}
        animate={{ height: expanded ? "100vh" : "6rem" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 backdrop-blur-lg bg-opacity-90 overflow-hidden"
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
                <div className="flex items-center">
                  <img
                    src={
                      currentTrack?.artistAvatar ||
                      "https://via.placeholder.com/30"
                    }
                    alt="Artist"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <p className="text-sm text-gray-200">
                    {currentTrack?.artist}
                  </p>
                </div>
              </div>
            </div>
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
                  <div className="flex items-center mb-8">
                    <img
                      src={
                        currentTrack?.artistAvatar ||
                        "https://via.placeholder.com/40"
                      }
                      alt="Artist"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <p className="text-xl text-gray-200">
                      {currentTrack?.artist}
                    </p>
                  </div>
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
                      className="w-full accent-yellow-300 bg-gray-300 dark:bg-gray-600 h-2 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm ml-2 text-white">
                      {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-8 mb-8">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(toggleShuffle())}
                      className={`text-white ${shuffle ? "text-yellow-300" : ""}`}
                    >
                      <ArrowsRightLeftIcon className="h-6 w-6" />
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
                      className="bg-white text-purple-600 rounded-full p-4 hover:bg-yellow-300 hover:text-purple-700 transition-colors shadow-lg"
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
                      onClick={() => dispatch(toggleRepeat())}
                      className={`text-white ${repeat ? "text-yellow-300" : ""}`}
                    >
                      <ArrowPathRoundedSquareIcon className="h-6 w-6" />
                    </motion.button>
                  </div>
                  <div className="flex items-center space-x-8">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setLiked(!liked)}
                      className={`${liked ? "text-red-500" : "text-white"}`}
                    >
                      <HeartIcon className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white"
                    >
                      <ShareIcon className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white"
                    >
                      <MicrophoneIcon className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white"
                    >
                      <MusicalNoteIcon className="h-6 w-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-8">
                  <div className="flex justify-center space-x-4 mb-4">
                    <button
                      className={`text-white ${activeTab === "visualizer" ? "border-b-2 border-white" : ""}`}
                      onClick={() => setActiveTab("visualizer")}
                    >
                      Visualizer
                    </button>
                    <button
                      className={`text-white ${activeTab === "lyrics" ? "border-b-2 border-white" : ""}`}
                      onClick={() => setActiveTab("lyrics")}
                    >
                      Lyrics
                    </button>
                    <button
                      className={`text-white ${activeTab === "queue" ? "border-b-2 border-white" : ""}`}
                      onClick={() => setActiveTab("queue")}
                    >
                      Queue
                    </button>
                  </div>

                  {activeTab === "visualizer" && (
                    <div className="w-full h-48">
                      <canvas
                        ref={canvasRef}
                        width="600"
                        height="200"
                        className="w-full h-full"
                      />
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

                  {activeTab === "queue" && (
                    <div className="text-white h-48 overflow-y-auto">
                      {queue.map((track, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex justify-between items-center mb-2 bg-white bg-opacity-10 rounded-lg p-2"
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
                              <p className="text-sm text-gray-300">
                                {track.artist}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromQueue(track.id))}
                            className="text-red-500 hover:text-red-300 transition-colors"
                          >
                            <XMarkIcon className="h-5 w-5" />
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
              className="w-24 accent-yellow-300 bg-gray-300 dark:bg-gray-600 h-2 rounded-lg appearance-none cursor-pointer"
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
