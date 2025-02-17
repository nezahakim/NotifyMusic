"use client";

import { FormEvent, useState } from 'react';
import Image from "next/image";
import { Search } from "@/utils/icons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAudioPlayer, useSearch } from '@/context/AudioContext';

interface Track{
thumbnail: string;
title: string;
artist: string;
}

const SearchResults = ({ results, onTrackSelect }: {
  results: Track[], onTrackSelect: (t: Track)=> void
}) => {
  return (
    <div className="max-h-48 overflow-y-auto px-0">
      {results.map( track => (
        <div 
          key={track.thumbnail}
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          onClick={() => onTrackSelect(track)}
        >
          <Image
            src={track.thumbnail}
            alt={track.artist}
            width={48}
            height={48}
            className="rounded-md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{track.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState([]);
  const moodFilters = ["Happy", "Chill", "Energetic", "Sad", "Romantic"];
  
  const player = useAudioPlayer();
  const { searchResults, searchTracks } = useSearch();


  const handleSubmit = (e: FormEvent) =>{
    e.preventDefault()

    searchTracks(searchQuery)
  }

  const handleMoodClick = (mood:string) =>{
    searchTracks(mood)
  }
  
  return (
    
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Notify Discover
        </h1>

        {/* Search Section */}
        <div className="relative">
          <form className="relative flex items-center" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Search tracks, artists, or moods..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all bg-white/80 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 text-gray-700">
              <Search className="w-5 h-5" />
            </div>
          </form>
        </div>

        {/* Mood Filters */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">Mood</h2>
          <div className="flex flex-wrap gap-2">
            {moodFilters.map((mood) => (
              <Badge
                key={mood}
                variant="secondary"
                onClick={() => handleMoodClick(mood)}
                className="px-4 py-1.5 rounded-full hover:bg-purple-100 cursor-pointer transition-all backdrop-blur-sm"
              >
                {mood}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">Search Results</h2>
          {searchResults.length > 0 ? (
                  <SearchResults 
                    key={1}
                    results={searchResults}
                    onTrackSelect={player.actions.playTrack}
                  />
                ) : (<p className="text-gray-500">No results found.</p>
                )}
        </div>
      </div>
    </div>
  );
};




export default Discover;