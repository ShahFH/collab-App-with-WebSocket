'use client';

import { useEffect, useRef, useState } from 'react';
import { getWebSocketUrl } from './websocket-config';

interface Point {
  x: number;
  y: number;
}

interface DrawingData {
  points: Point[];
  color: string;
  width: number;
}

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(2);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(getWebSocketUrl());
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data: DrawingData = JSON.parse(event.data);
        drawPath(data.points, data.color, data.width);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
        
        // Try to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket server:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, []);

  // Rest of the code remains the same...
  const drawPath = (points: Point[], strokeColor: string, strokeWidth: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    ctx.stroke();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setIsDrawing(true);
    setCurrentPath([point]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setCurrentPath((prev) => {
      const newPath = [...prev, point];
      drawPath(newPath, color, width);

      // Send the drawing data to other clients
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          points: newPath,
          color,
          width,
        }));
      }

      return newPath;
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return {
    canvasRef,
    color,
    width,
    setColor,
    setWidth,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    isConnected,
  };
};