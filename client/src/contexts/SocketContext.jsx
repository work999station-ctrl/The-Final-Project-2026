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
    // Connect through the Vite proxy (or same origin in production)
    const s = io('/', {
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
