import React, { useState } from 'react';
import Image from "next/image";
import { Search, Plus } from "@/utils/icons";

const MusicSearch = ({ onAddToQueue }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const response = await fetch(`http://localhost:3001/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
      <div className="p-4">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder="Search for music..."
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </form>

        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="text-center py-4">
              <span className="text-gray-500">Searching...</span>
            </div>
          ) : (
            searchResults.map((track:any) => (
              <div 
                key={track.videoId}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg group"
              >
                <Image
                  src={track.thumbnail}
                  alt={track.title}
                  width={48}
                  height={48}
                  className="rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                </div>
                <button 
                  onClick={() => onAddToQueue(track)}
                  className="p-2 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicSearch;