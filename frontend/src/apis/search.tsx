"use client"
import { API_BASE } from "@/utils/endpoints";


const SearchAPI = async (query: string) =>{
    const searchRes = await fetch(`${API_BASE}/search?q=${query}`);
    const { videoId } = await searchRes.json();
  
    if (!videoId) {
      console.error("No results found.");
      return;
    }

    return( videoId )
  
    // const audio = new Audio(`${API_BASE}/stream?videoId=${videoId}`);
    // audio.play();
}

export default SearchAPI;