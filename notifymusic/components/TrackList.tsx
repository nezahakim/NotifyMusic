import { PlayIcon } from "@heroicons/react/solid";
import { Track } from "../types";

interface TrackListProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
}

export default function TrackList({ tracks, onTrackSelect }: TrackListProps) {
  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <img
            src={track.album.images[0].url}
            alt={track.name}
            className="w-16 h-16 rounded"
          />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {track.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {track.artists[0].name}
            </p>
          </div>
          <button
            onClick={() => onTrackSelect(track)}
            className="p-2 rounded-full bg-primary-light text-white hover:bg-primary-dark"
          >
            <PlayIcon className="h-6 w-6" />
          </button>
        </div>
      ))}
    </div>
  );
}
