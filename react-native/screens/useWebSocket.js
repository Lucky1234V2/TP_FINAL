import {useEffect, useRef, useState} from 'react';

const useWebSocket = url => {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.current.close();
    };
  }, [url]);

  const sendMessage = message => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return {isConnected, sendMessage};
};

export default useWebSocket;
