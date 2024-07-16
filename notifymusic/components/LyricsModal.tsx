import { useState, useEffect } from "react";
import { XIcon } from "@heroicons/react/24/solid";
import { getLyrics } from "../lib/api";
import { Track } from "../types";

interface LyricsModalProps {
  track: Track;
  onClose: () => void;
}

export default function LyricsModal({ track, onClose }: LyricsModalProps) {
  const [lyrics, setLyrics] = useState("");

  useEffect(() => {
    const fetchLyrics = async () => {
      const lyricsText = await getLyrics(track.artists[0].name, track.name);
      setLyrics(lyricsText);
    };
    fetchLyrics();
  }, [track]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {track.name} - Lyrics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
          {lyrics}
        </p>
      </div>
    </div>
  );
}
