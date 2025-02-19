import { useRef, useState, useEffect } from "react";
import { useSocket } from '@/context/SocketContext';
import { Track } from "@/lib/types";

export const useAudioPlayerHook = () => {
    const audioRef = useRef(typeof window !== 'undefined' ? new window.Audio() : null);
    const { socket, currentRoom, roomState } = useSocket();
    const audioChunksRef = useRef<Uint8Array[]>([]);
    const [isBuffering, setIsBuffering] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !socket) return;
        
        if (!audioRef.current) {
            audioRef.current = new window.Audio();
        }
        
        const audio = audioRef.current;

        // Add user interaction listener
        const handleUserInteraction = () => {
            setHasUserInteracted(true);
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('keydown', handleUserInteraction);
        window.addEventListener('touchstart', handleUserInteraction);
        
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
        audio.addEventListener('waiting', () => setIsBuffering(true));
        audio.addEventListener('playing', () => {
            setIsBuffering(false);
            setIsPlaying(true);
        });
        audio.addEventListener('pause', () => setIsPlaying(false));
        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            socket.emit('playback-ended', { roomId: currentRoom });
        });

        // Handle stream events
        socket.on('stream-start', ({ startTime, track }) => {
            console.log('Stream starting:', track);
            audioChunksRef.current = [];
            setIsBuffering(true);
            setCurrentTime(0);
            setCurrentTrack(track);
            
            if (audio.src) {
                URL.revokeObjectURL(audio.src);
                audio.src = '';
            }
        });

        socket.on('audio-chunk', ({ data, track }) => {
            if (!currentTrack || track.videoId !== currentTrack.videoId) return;
            
            const chunk = new Uint8Array(data);
            audioChunksRef.current.push(chunk);
        });

        socket.on('stream-end', async ({ videoId }) => {
            if (!currentTrack || videoId !== currentTrack.videoId) return;
            
            try {
                const totalLength = audioChunksRef.current.reduce((acc, chunk) => acc + chunk.length, 0);
                const combinedBuffer = new Uint8Array(totalLength);
                
                let offset = 0;
                audioChunksRef.current.forEach(chunk => {
                    combinedBuffer.set(chunk, offset);
                    offset += chunk.length;
                });

                const audioBlob = new Blob([combinedBuffer], { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(audioBlob);

                audio.src = audioUrl;
                await audio.load();
                
                if (hasUserInteracted && isPlaying) {
                    try {
                        await audio.play();
                    } catch (error) {
                        console.error('Playback failed:', error);
                    }
                }
                
                setIsBuffering(false);
            } catch (error) {
                console.error('Error processing audio:', error);
                setIsBuffering(false);
            }
        });

        // Handle playback control events
        socket.on('playback-update', async ({ isPlaying: newIsPlaying, currentTime: newTime }) => {
            if (!audio.src) return;

            if (Math.abs(audio.currentTime - newTime) > 1) {
                audio.currentTime = newTime;
            }
            
            if (newIsPlaying && audio.paused) {
                if (hasUserInteracted) {
                    try {
                        await audio.play();
                    } catch (error) {
                        console.error('Playback failed:', error);
                    }
                }
            } else if (!newIsPlaying && !audio.paused) {
                audio.pause();
            }
            
            setIsPlaying(newIsPlaying);
        });

        return () => {
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
            
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', () => {});
            audio.removeEventListener('waiting', () => {});
            audio.removeEventListener('playing', () => {});
            audio.removeEventListener('pause', () => {});
            audio.removeEventListener('ended', () => {});
            
            if (audio.src) {
                URL.revokeObjectURL(audio.src);
            }

            socket.off('stream-start');
            socket.off('audio-chunk');
            socket.off('stream-end');
            socket.off('playback-update');
        };
    }, [socket, currentRoom, currentTrack, hasUserInteracted, isPlaying]);

    const playTrack = async (track: Track) => {
        if (!socket || !currentRoom) return;
        
        try {
            setIsBuffering(true);
            audioChunksRef.current = [];
            setCurrentTrack(track);
            
            socket.emit('stream', {
                track,
                roomId: currentRoom
            });
            
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing track:', error);
            setIsBuffering(false);
        }
    };

    const togglePlay = async () => {
        if (!socket || !currentRoom || !audioRef.current || !currentTrack) return;
        
        const newIsPlaying = !isPlaying;
        
        if (newIsPlaying && !hasUserInteracted) {
            console.warn('Cannot play audio before user interaction');
            return;
        }
        
        socket.emit('playback-state', {
            isPlaying: newIsPlaying,
            currentTime: audioRef.current.currentTime,
            roomId: currentRoom
        });

        setIsPlaying(newIsPlaying);
        
        try {
            if (newIsPlaying) {
                await audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        } catch (error) {
            console.error('Playback control failed:', error);
        }
    };

    const seek = (time: number) => {
        if (!socket || !currentRoom || !audioRef.current) return;
        
        audioRef.current.currentTime = time;
        socket.emit('seek', {
            time,
            roomId: currentRoom
        });
    };
    
    return {
        isPlaying,
        currentTime,
        duration,
        currentTrack,
        isBuffering,
        hasUserInteracted,
        actions: {
            playTrack,
            togglePlay,
            seek
        }
    };
};