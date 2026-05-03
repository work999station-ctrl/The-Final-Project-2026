import { useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';

/**
 * useSocket — returns the shared Socket.IO instance.
 * Usage:
 *   const socket = useSocket();
 *   useEffect(() => {
 *     if (!socket) return;
 *     socket.on('user:updated', handler);
 *     return () => socket.off('user:updated', handler);
 *   }, [socket]);
 */
const useSocket = () => useContext(SocketContext);

export default useSocket;
