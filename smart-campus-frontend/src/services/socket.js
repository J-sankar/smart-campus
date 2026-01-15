import { io } from "socket.io-client";

// Configuration
const SOCKET_URL = "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  /**
   * Initializes the socket connection if it doesn't exist.
   * Returns the socket instance.
   */
  connect() {
    if (!this.socket) {
      console.log("🔌 Initializing WebSocket Singleton...");
      
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"], // Avoid polling, go straight to WS
        reconnectionAttempts: 5,   // Auto-reconnect if server restarts
      });

      // Global Debug Listeners
      this.socket.on("connect", () => {
        console.log(`✅ WS Connected: ${this.socket.id}`);
      });

      this.socket.on("disconnect", (reason) => {
        console.log(`❌ WS Disconnected: ${reason}`);
      });
    }
    return this.socket;
  }

  /**
   * Gets the active socket instance.
   */
  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  /**
   * Disconnects the socket (Useful for logout).
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Export a single instance of the class
const socketService = new SocketService();
export default socketService;