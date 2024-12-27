'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DrawingData } from '../types/drawing';
import { getSocketConfig } from './socket-config';

export const useSocket = (onDrawingData: (data: DrawingData) => void) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const { url, options } = getSocketConfig();
    socketRef.current = io(url, options);

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    socket.on('draw', onDrawingData);

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [onDrawingData]);

  const sendDrawingData = (data: DrawingData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('draw', data);
    }
  };

  return {
    sendDrawingData,
    isConnected,
  };
};