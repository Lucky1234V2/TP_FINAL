import {useEffect, useRef, useState} from 'react';

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: Record<string, unknown>) => void;
}

const useWebSocket = (url: string): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: Record<string, unknown>) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return {isConnected, sendMessage};
};

export default useWebSocket;
