/**
 * WebSocket Client for LexAI
 *
 * Production-ready WebSocket implementation with:
 * - Automatic reconnection
 * - Connection state management
 * - Safe message sending with readyState checks
 * - Environment-based URL configuration
 * - Comprehensive error handling and logging
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageHandler = (data: any) => void;
type ErrorHandler = (error: Event) => void;
type ConnectionHandler = () => void;

interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

class WebSocketClient {
  private socket: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isIntentionallyClosed = false;

  // Event handlers
  private messageHandlers: Set<MessageHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private openHandlers: Set<ConnectionHandler> = new Set();
  private closeHandlers: Set<ConnectionHandler> = new Set();

  constructor(config?: Partial<WebSocketConfig>) {
    // Get WebSocket URL from environment or use intelligent default
    const wsUrl = this.getWebSocketUrl();

    this.config = {
      url: wsUrl,
      reconnectInterval: 3000, // 3 seconds
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000, // 30 seconds
      ...config,
    };

    // Start connection
    this.connect();
  }

  /**
   * Get WebSocket URL from environment or construct from window.location
   */
  private getWebSocketUrl(): string {
    // Check for Next.js environment variable
    if (process.env.NEXT_PUBLIC_WS_URL) {
      return process.env.NEXT_PUBLIC_WS_URL;
    }

    // Fallback to constructing URL from current host
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = '8080'; // LexAI backend port
      return `${protocol}//${host}:${port}/ws`;
    }

    // Final fallback for SSR or testing
    return 'ws://localhost:8080/ws';
  }

  /**
   * Establish WebSocket connection
   */
  private connect(): void {
    try {
      console.log(`[WebSocket] Connecting to ${this.config.url}...`);

      this.socket = new WebSocket(this.config.url);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onerror = this.handleError.bind(this);
      this.socket.onclose = this.handleClose.bind(this);

    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Handle connection opened
   */
  private handleOpen(_event: Event): void {
    console.log('[WebSocket] ✅ Connected successfully');
    this.reconnectAttempts = 0;
    this.isIntentionallyClosed = false;

    // Start heartbeat - DISABLED: Backend treats pings as user messages
    // this.startHeartbeat();

    // Notify all open handlers
    this.openHandlers.forEach(handler => handler());
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(event: MessageEvent): void {
    let parsedData;

    // Try to parse as JSON first
    if (typeof event.data === 'string' && (event.data.trim().startsWith('{') || event.data.trim().startsWith('['))) {
      try {
        parsedData = JSON.parse(event.data);
        console.log('[WebSocket] 📨 JSON message received:', parsedData);
      } catch (error) {
        // Failed to parse JSON, treat as plain text
        parsedData = { message: event.data };
        console.log('[WebSocket] 📨 Text message received:', event.data);
      }
    } else {
      // Plain text message - wrap it in a consistent format
      parsedData = { message: event.data };
      console.log('[WebSocket] 📨 Text message received:', event.data);
    }

    // Notify all message handlers
    this.messageHandlers.forEach(handler => handler(parsedData));
  }

  /**
   * Handle errors
   */
  private handleError(event: Event): void {
    console.error('[WebSocket] ❌ Error occurred:', event);

    // Notify all error handlers
    this.errorHandlers.forEach(handler => handler(event));
  }

  /**
   * Handle connection closed
   */
  private handleClose(event: CloseEvent): void {
    console.log(`[WebSocket] 🔌 Connection closed (Code: ${event.code}, Reason: ${event.reason || 'No reason provided'})`);

    // Stop heartbeat
    this.stopHeartbeat();

    // Notify all close handlers
    this.closeHandlers.forEach(handler => handler());

    // Attempt to reconnect unless intentionally closed
    if (!this.isIntentionallyClosed) {
      this.scheduleReconnect();
    }
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error(`[WebSocket] ⚠️ Max reconnection attempts (${this.config.maxReconnectAttempts}) reached. Giving up.`);
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    const delay = this.config.reconnectInterval * Math.min(this.reconnectAttempts, 5); // Exponential backoff cap at 5x

    console.log(`[WebSocket] 🔄 Reconnecting in ${delay}ms (Attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing heartbeat

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping' });
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Check if socket is connected and ready
   */
  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Get current connection state
   */
  public getState(): string {
    if (!this.socket) return 'CLOSED';

    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }

  /**
   * Send message safely with readyState check
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public send(data: any): boolean {
    if (!this.isConnected()) {
      console.warn('[WebSocket] ⚠️ Cannot send message - WebSocket not open. Current state:', this.getState());
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.socket!.send(message);
      console.log('[WebSocket] 📤 Message sent:', data);
      return true;
    } catch (error) {
      console.error('[WebSocket] Failed to send message:', error);
      return false;
    }
  }

  /**
   * Send a text message (convenience method)
   */
  public sendMessage(message: string): boolean {
    return this.send({ type: 'message', content: message });
  }

  /**
   * Register message handler
   */
  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * Register error handler
   */
  public onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  /**
   * Register open handler
   */
  public onOpen(handler: ConnectionHandler): () => void {
    this.openHandlers.add(handler);
    return () => this.openHandlers.delete(handler);
  }

  /**
   * Register close handler
   */
  public onClose(handler: ConnectionHandler): () => void {
    this.closeHandlers.add(handler);
    return () => this.closeHandlers.delete(handler);
  }

  /**
   * Manually close the connection
   */
  public close(code = 1000, reason = 'Client closed connection'): void {
    console.log('[WebSocket] 👋 Closing connection manually...');
    this.isIntentionallyClosed = true;

    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close(code, reason);
      this.socket = null;
    }
  }

  /**
   * Manually reconnect
   */
  public reconnect(): void {
    console.log('[WebSocket] 🔄 Manual reconnect requested...');
    this.close(1000, 'Reconnecting');
    this.isIntentionallyClosed = false;
    this.reconnectAttempts = 0;
    this.connect();
  }

  /**
   * Get the raw socket instance (use with caution)
   */
  public getSocket(): WebSocket | null {
    return this.socket;
  }
}

// Create singleton instance
const wsClient = new WebSocketClient();

// Export singleton instance and convenience functions
export default wsClient;

export const socket = wsClient;

export const sendMessage = (message: string): boolean => {
  return wsClient.sendMessage(message);
};

export const isConnected = (): boolean => {
  return wsClient.isConnected();
};

export const getConnectionState = (): string => {
  return wsClient.getState();
};

// Export for React hooks or cleanup
export const closeConnection = (): void => {
  wsClient.close();
};

export const reconnect = (): void => {
  wsClient.reconnect();
};
