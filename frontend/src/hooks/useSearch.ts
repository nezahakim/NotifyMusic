import { API_BASE } from "@/lib/endpoints";
import { Track } from "@/lib/types";
import { useState } from "react";

// Search hook
export const useSearchHook = () => {
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTracks = async (query: string | number | boolean) => {
    try {
      setIsSearching(true);
      const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return { searchResults, isSearching, searchTracks };
};
