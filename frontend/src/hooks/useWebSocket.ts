/**
 * React Hook for WebSocket
 *
 * Usage example:
 * ```tsx
 * const { sendMessage, isConnected, lastMessage } = useWebSocket();
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import wsClient from '@/api/socket';

interface UseWebSocketReturn {
  sendMessage: (message: string) => boolean;
  isConnected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastMessage: any;
  connectionState: string;
  reconnect: () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(wsClient.isConnected());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [connectionState, setConnectionState] = useState(wsClient.getState());

  useEffect(() => {
    // Subscribe to connection events
    const unsubscribeOpen = wsClient.onOpen(() => {
      setIsConnected(true);
      setConnectionState(wsClient.getState());
    });

    const unsubscribeClose = wsClient.onClose(() => {
      setIsConnected(false);
      setConnectionState(wsClient.getState());
    });

    const unsubscribeMessage = wsClient.onMessage((data) => {
      // Add timestamp to force React to recognize each message as unique
      setLastMessage({
        ...data,
        _timestamp: Date.now()
      });
    });

    const unsubscribeError = wsClient.onError((error) => {
      console.error('[useWebSocket] Error:', error);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeOpen();
      unsubscribeClose();
      unsubscribeMessage();
      unsubscribeError();
    };
  }, []);

  const sendMessage = useCallback((message: string): boolean => {
    return wsClient.sendMessage(message);
  }, []);

  const reconnect = useCallback(() => {
    wsClient.reconnect();
  }, []);

  return {
    sendMessage,
    isConnected,
    lastMessage,
    connectionState,
    reconnect,
  };
};

export default useWebSocket;
