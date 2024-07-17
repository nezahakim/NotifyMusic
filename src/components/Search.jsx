// src/components/Search.jsx
import React, { useState } from "react";
import { SearchIcon } from "@heroicons/react/24/outline";
import TrackList from "./TrackList";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Mocked search results (replace with actual API call)
    setSearchResults([
      { id: 1, title: "Search Result 1", artist: "Artist 1" },
      { id: 2, title: "Search Result 2", artist: "Artist 2" },
    ]);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs, artists, or albums"
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
          >
            <SearchIcon className="h-6 w-6" />
          </button>
        </div>
      </form>
      {searchResults.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <TrackList tracks={searchResults} />
        </div>
      )}
    </div>
  );
};

export default Search;
