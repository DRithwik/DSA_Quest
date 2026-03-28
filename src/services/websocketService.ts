// WebSocket service for multiplayer Code Wars
// Uses socket.io-client when a backend is available.
// Currently provides a mock implementation for frontend development.

type EventHandler = (...args: any[]) => void;

class WebSocketService {
  private listeners: Map<string, EventHandler[]> = new Map();
  private connected = false;

  connect() {
    // In production: connect to socket.io server
    // import { io } from 'socket.io-client';
    // this.socket = io(SOCKET_URL, { auth: { token } });
    this.connected = true;
    console.log('[WS] Connected (mock)');
  }

  disconnect() {
    this.connected = false;
    this.listeners.clear();
    console.log('[WS] Disconnected');
  }

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(handler);
  }

  off(event: string, handler?: EventHandler) {
    if (!handler) {
      this.listeners.delete(event);
    } else {
      const handlers = this.listeners.get(event) || [];
      this.listeners.set(event, handlers.filter(h => h !== handler));
    }
  }

  emit(event: string, data?: any) {
    console.log(`[WS] Emit: ${event}`, data);
    // In production: this.socket.emit(event, data);
  }

  // Simulate server events for development
  simulateEvent(event: string, data: any) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(h => h(data));
  }

  isConnected() {
    return this.connected;
  }
}

// Events:
// MATCH_FOUND    → { opponent, problemId }
// PROGRESS_UPDATE → { opponentProgress }
// GAME_RESULT    → { result, xpGained, eloChange }

export const wsService = new WebSocketService();
export default wsService;
