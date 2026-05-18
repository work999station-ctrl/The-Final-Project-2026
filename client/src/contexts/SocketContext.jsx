import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

/**
 * SocketProvider — Creates a single Socket.IO connection for the entire app.
 * All components access the same socket via useSocket().
 */
export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the backend URL from env vars (for production) or proxy/same-origin (dev)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '/';
    const s = io(backendUrl, {
      withCredentials: true
    });


    s.on('connect', () => {
      console.log('Socket connected:', s.id);
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current = s;
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };
export default SocketContext;
