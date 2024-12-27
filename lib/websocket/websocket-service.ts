'use client';

import { DrawingData } from '../types/drawing';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(
    private url: string,
    private onMessage: (data: DrawingData) => void,
    private onConnectionChange: (connected: boolean) => void
  ) {}

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('Connected to WebSocket server');
        this.onConnectionChange(true);
      };

      this.ws.onmessage = (event) => {
        const data: DrawingData = JSON.parse(event.data);
        this.onMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onConnectionChange(false);
      };

      this.ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
        this.onConnectionChange(false);
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket server:', error);
      this.onConnectionChange(false);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
  }

  send(data: DrawingData) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.ws?.close();
  }
}