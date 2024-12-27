import { DrawingCanvas } from '@/components/ui/drawing-canvas';

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Collaborative Drawing App</h1>
        <DrawingCanvas />
      </div>
    </div>
  );
}