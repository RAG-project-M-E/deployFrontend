# WebSocket Client Documentation

## Overview

Production-ready WebSocket client for LexAI with automatic reconnection, error handling, and React hooks support.

## Quick Start

### Option 1: Using the React Hook (Recommended)

```tsx
import { useWebSocket } from '@/hooks/useWebSocket';

function ChatComponent() {
  const { sendMessage, isConnected, lastMessage, connectionState } = useWebSocket();

  const handleSend = () => {
    if (isConnected) {
      sendMessage('Hello from React!');
    }
  };

  return (
    <div>
      <p>Status: {connectionState}</p>
      <button onClick={handleSend} disabled={!isConnected}>
        Send Message
      </button>
      {lastMessage && <p>Last message: {JSON.stringify(lastMessage)}</p>}
    </div>
  );
}
```

### Option 2: Direct Import

```tsx
import { socket, sendMessage, isConnected } from '@/api/socket';

// Send a message
if (isConnected()) {
  sendMessage('Hello WebSocket!');
}

// Listen to messages
socket.onMessage((data) => {
  console.log('Received:', data);
});

// Listen to connection events
socket.onOpen(() => {
  console.log('Connected!');
});

socket.onClose(() => {
  console.log('Disconnected!');
});
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

### URL Resolution

The client automatically resolves the WebSocket URL in this order:

1. **Environment Variable**: `NEXT_PUBLIC_WS_URL` from `.env`
2. **Auto-detection**: `ws://${window.location.hostname}:8080/ws`
3. **Fallback**: `ws://localhost:8080/ws`

## Features

### ✅ Automatic Reconnection
- Reconnects automatically if connection is lost
- Exponential backoff (3s, 6s, 9s, 12s, 15s)
- Maximum 10 reconnection attempts
- Configurable intervals

### ✅ Safe Message Sending
- Always checks `readyState` before sending
- Returns `true` if sent successfully, `false` otherwise
- No "WebSocket is not open" errors

### ✅ Heartbeat
- Sends ping every 30 seconds to keep connection alive
- Automatic cleanup on disconnect

### ✅ Event Handlers
- `onMessage(handler)` - Receive messages
- `onOpen(handler)` - Connection opened
- `onClose(handler)` - Connection closed
- `onError(handler)` - Error occurred

### ✅ Connection State
- `isConnected()` - Boolean check
- `getState()` - Returns: CONNECTING, OPEN, CLOSING, or CLOSED

## API Reference

### `sendMessage(message: string): boolean`
Send a text message safely.

```ts
const success = sendMessage('Hello!');
if (!success) {
  console.error('Failed to send message');
}
```

### `isConnected(): boolean`
Check if connected and ready to send.

```ts
if (isConnected()) {
  sendMessage('Ready to send!');
}
```

### `getConnectionState(): string`
Get current connection state.

```ts
const state = getConnectionState(); // "OPEN", "CONNECTING", "CLOSED", etc.
```

### `reconnect(): void`
Manually trigger reconnection.

```ts
reconnect();
```

### `closeConnection(): void`
Manually close the connection.

```ts
closeConnection();
```

## Message Format

### Sending

The client automatically wraps messages in JSON:

```ts
sendMessage('Hello');
// Sends: {"type": "message", "content": "Hello"}
```

Or send custom objects:

```ts
socket.send({ type: 'chat', user: 'John', text: 'Hi' });
```

### Receiving

Messages are automatically parsed from JSON:

```ts
socket.onMessage((data) => {
  console.log(data.type);    // "message"
  console.log(data.content); // "Hello"
});
```

## Error Handling

All errors are logged and won't crash your app:

```ts
socket.onError((error) => {
  console.error('WebSocket error:', error);
  // Handle error (show notification, etc.)
});
```

## Production Deployment

### For HTTPS Sites

Update `.env.production`:

```env
NEXT_PUBLIC_WS_URL=wss://your-domain.com/ws
```

The client automatically uses `wss://` for HTTPS sites.

### Docker/Kubernetes

Use environment variables:

```yaml
environment:
  - NEXT_PUBLIC_WS_URL=ws://backend-service:8080/ws
```

## Testing

```ts
// Check connection
console.log('Connected?', isConnected());
console.log('State:', getConnectionState());

// Send test message
const sent = sendMessage('Test message');
console.log('Sent?', sent);
```

## Troubleshooting

### "WebSocket is not open" Error

✅ **Fixed!** The client checks `readyState` before sending.

### Connection Keeps Dropping

- Check backend WebSocket endpoint
- Verify firewall/proxy settings
- Check browser console for errors

### Not Connecting

1. Verify WebSocket URL: `console.log(socket.getSocket()?.url)`
2. Check backend is running: `curl http://localhost:8080/ws`
3. Check browser console for errors

## Backend Integration

Your FastAPI backend should accept WebSocket connections at `/ws`:

```python
from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")
```

## Examples

### Chat Application

```tsx
const Chat = () => {
  const { sendMessage, isConnected, lastMessage } = useWebSocket();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (lastMessage) {
      setMessages(prev => [...prev, lastMessage]);
    }
  }, [lastMessage]);

  const handleSend = (text: string) => {
    if (isConnected) {
      sendMessage(text);
    }
  };

  return <ChatUI messages={messages} onSend={handleSend} />;
};
```

### Real-time Notifications

```tsx
useEffect(() => {
  const unsubscribe = socket.onMessage((data) => {
    if (data.type === 'notification') {
      showNotification(data.message);
    }
  });

  return unsubscribe;
}, []);
```
