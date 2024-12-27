const { WebSocket } = require('ws');

class WebSocketHandler {
  constructor() {
    this.connections = new Set();
  }

  handleConnection(ws) {
    console.log('New client connected');
    this.connections.add(ws);

    ws.on('message', (message) => this.handleMessage(ws, message));
    ws.on('close', () => this.handleClose(ws));
    ws.on('error', this.handleError);
  }

  handleMessage(ws, message) {
    try {
      const data = JSON.parse(message);
      this.broadcast(ws, data);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  broadcast(sender, data) {
    this.connections.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  handleClose(ws) {
    console.log('Client disconnected');
    this.connections.delete(ws);
  }

  handleError(error) {
    console.error('WebSocket error:', error);
  }
}

module.exports = WebSocketHandler;