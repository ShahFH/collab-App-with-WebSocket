export interface Point {
  x: number;
  y: number;
}

export interface DrawingData {
  points: Point[];
  color: string;
  width: number;
}