import { useState } from "react";

// Search hook
export const useSearchHook = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTracks = async (query: string | number | boolean) => {
    try {
      setIsSearching(true);
      const response = await fetch(`http://localhost:3001/search?q=${encodeURIComponent(query)}`);
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
