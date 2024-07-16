"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import searchTracks from "../../lib/spotify";
import TrackCard from "../../components/TrackCard";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const tracks = await searchTracks(query);
        setResults(tracks);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tracks. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePlay = (track: Track) => {
    // TODO: Implement play functionality
    console.log("Playing:", track.name);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search for Music</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l"
            placeholder="Search for songs..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r"
            disabled={isLoading}
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
        </div>
      </form>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onPlay={() => handlePlay(track)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
