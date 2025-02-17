import { Track } from "@/lib/types";
import { useRef, useState, useEffect } from "react";

// Custom hook for audio handling and caching
export const useAudioPlayerHook = () => {
  // const audioRef = useRef(new Audio());
  const audioRef = useRef(typeof window !== 'undefined' ? new window.Audio() : null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState([]);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initialize audio element if not already done
    if (!audioRef.current) {
      audioRef.current = new window.Audio();
    }
    
    // Audio event listeners
    const audio = audioRef.current;
    
    const handleTrackEnd = () => {
      if (queue.length > 0) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    const playTrack = async (track: Track) => {
      try {
        setIsBuffering(true);
  
        // const cachedTrack = await checkCache(track.videoId);
        
        const response = await fetch(`http://localhost:3001/stream?videoId=${track.videoId}`);
        const arrayBuffer = await response.arrayBuffer();
        
        // Create a proper audio blob with correct MIME type
        const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          // Clean up previous audio URL if exists
          if (audioRef.current.src) {
            URL.revokeObjectURL(audioRef.current.src);
          }
          
          audioRef.current.src = audioUrl;
          audioRef.current.preload = "auto";
          
          // Set up event handlers
          const playPromise = audioRef.current.play();
          if (playPromise) {
            await playPromise;
            setIsPlaying(true);
            setCurrentTrack(track);
          }
        }
      } catch (error) {
        console.error('Error playing track:', error);
        playTrack(track)
      } finally {
        setIsBuffering(false);
      }
    };
    

    const playNext = () => {
      if (queue.length > 0) {
        const nextTrack = queue[0];
        setQueue(prev => prev.slice(1));
        playTrack(nextTrack);
      }
    };
  

    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('waiting', () => setIsBuffering(true));
    audio.addEventListener('playing', () => setIsBuffering(false));
    
    return () => {
      audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.removeEventListener('loadedmetadata', () => setDuration(audio.duration));
      audio.removeEventListener('ended', handleTrackEnd);
      audio.removeEventListener('waiting', () => setIsBuffering(true));
      audio.removeEventListener('playing', () => setIsBuffering(false));
    };
  }, [queue]);

  const playTrack = async (track: Track) => {
    try {
      setIsBuffering(true);

      // const cachedTrack = await checkCache(track.videoId);
      
      const response = await fetch(`http://localhost:3001/stream?videoId=${track.videoId}`);
      const arrayBuffer = await response.arrayBuffer();
      
      // Create a proper audio blob with correct MIME type
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        // Clean up previous audio URL if exists
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        
        audioRef.current.src = audioUrl;
        audioRef.current.preload = "auto";
        
        // Set up event handlers
        const playPromise = audioRef.current.play();
        if (playPromise) {
          await playPromise;
          setIsPlaying(true);
          setCurrentTrack(track);
        }
      }
    } catch (error) {
      console.error('Error playing track:', error);
      playTrack(track)
    } finally {
      setIsBuffering(false);
    }
  };
  
  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);
  
  
  const togglePlay = () => {
    if(audioRef.current){
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };
  

  const playNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(prev => prev.slice(1));
      playTrack(nextTrack);
    }
  };

  const [history, setHistory] = useState<Track[]>([]);

  const playPrevious = () => {
    if (history.length > 0) {
      const prevTrack = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      playTrack(prevTrack);
    }
  };
  

  return {
    isPlaying,
    currentTime,
    duration,
    currentTrack,
    isBuffering,
    queue,
    actions: {
      playTrack,
      togglePlay,
      seek,
      addToQueue,
      playNext,
      playPrevious
    }
  };
};
