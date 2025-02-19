import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';

export const useEntry = () => {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { joinRoom } = useSocket();

    const handleEntry = async () => {
        if (!username.trim() || !roomId.trim()) {
            setError('Username and Room ID are required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await joinRoom(roomId);
            
            if (result.success) {
                localStorage.setItem('username', username);
                localStorage.setItem('roomId', roomId);
                window.location.href = '/home';
            } else {
                setError(result.error || 'Failed to join room');
            }
        } catch (err) {
            console.log(err)
            setError('Connection failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        username,
        setUsername,
        roomId,
        setRoomId,
        isLoading,
        error,
        handleEntry
    };
};
