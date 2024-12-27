'use client';

import { useRef, useState } from 'react';
import { Point } from '../types/drawing';
import { drawPath, clearCanvas, getCanvasPoint } from './draw-utils';

export const useDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(2);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const point = getCanvasPoint(e, canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    return point;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return null;
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const point = getCanvasPoint(e, canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();

    return point;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    clearCanvas(ctx, canvas.width, canvas.height);
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
    handleClear,
  };
};