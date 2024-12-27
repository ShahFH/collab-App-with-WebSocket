'use client';

import { useDrawing } from '@/lib/canvas/useDrawing';
import { useSocket } from '@/lib/socket/useSocket';
import { Button } from './button';
import { Input } from './input';
import { Slider } from './slider';
import { drawPath } from '@/lib/canvas/draw-utils';
import { CANVAS_CONFIG } from '@/lib/config/constants';

export function DrawingCanvas() {
  const {
    canvasRef,
    color,
    width,
    setColor,
    setWidth,
    startDrawing,
    draw,
    stopDrawing,
    handleClear,
  } = useDrawing();

  const handleDrawingData = (data: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawPath(ctx, data.points, data.color, data.width);
  };

  const { sendDrawingData, isConnected } = useSocket(handleDrawingData);

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = draw(e);
    if (point) {
      sendDrawingData({
        points: [point],
        color,
        width,
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 mb-4">
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-10"
        />
        <div className="flex items-center gap-2">
          <span>Width:</span>
          <Slider
            value={[width]}
            onValueChange={(value) => setWidth(value[0])}
            min={1}
            max={20}
            step={1}
            className="w-32"
          />
        </div>
        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
        <div 
          className={`h-3 w-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} 
          title={isConnected ? 'Connected' : 'Disconnected'}
        />
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_CONFIG.WIDTH}
        height={CANVAS_CONFIG.HEIGHT}
        onMouseDown={startDrawing}
        onMouseMove={handleDraw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className="border border-gray-200 rounded-lg shadow-md bg-white"
      />
    </div>
  );
}