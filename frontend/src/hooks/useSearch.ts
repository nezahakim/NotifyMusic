// import { API_BASE } from "@/lib/endpoints";
// import { Track } from "@/lib/types";
// import { useState } from "react";

// // Search hook
// export const useSearchHook = () => {
//   const [searchResults, setSearchResults] = useState<Track[]>([]);
//   const [isSearching, setIsSearching] = useState(false);

//   const searchTracks = async (query: string | number | boolean) => {
//     try {
//       setIsSearching(true);
//       const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
//       const data = await response.json();
//       setSearchResults(data);
//     } catch (error) {
//       console.error('Search failed:', error);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   return { searchResults, isSearching, searchTracks };
// };

import { Track } from "@/lib/types";
import { useState, useEffect } from "react";
import { useSocket } from '@/context/SocketContext';

export const useSearchHook = () => {
    const { socket, currentRoom, isConnected , joinRoom} = useSocket();
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    useEffect( () => {
        if (!socket || !isConnected || !currentRoom) return;
            
        socket.on('search-results', (data: { results: Track[], query: string }) => {
            setSearchResults(data.results);
            setIsSearching(false);
            setSearchError(null);
        });

        socket.on('search-error', ({ message, query }) => {
            setSearchError(message);
            setIsSearching(false);
            setSearchResults([]);
        });

        return () => {
            socket.off('search-results');
            socket.off('search-error');
        };
    }, [socket, currentRoom, isConnected]);

    const searchTracks = (query: string | number | boolean) => {
        if (!socket || !currentRoom) {
            setSearchError('Must join a room first');
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        socket.emit('search', {
            query: encodeURIComponent(query),
            roomId: currentRoom
        });
    };

    const clearSearch = () => {
        setSearchResults([]);
        setSearchError(null);
    };
    
    return {
        searchResults,
        isSearching,
        searchError,
        searchTracks,
        clearSearch
    };
};
