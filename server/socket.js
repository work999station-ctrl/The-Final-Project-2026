/**
 * socket.js — Socket.IO singleton
 * Holds the io instance so any controller can emit events
 * without circular dependencies.
 */

let _io = null;

const init = (httpServer) => {
  const { Server } = require('socket.io');
  _io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? [/\.vercel\.app$/, process.env.FRONTEND_URL]
        : (origin, callback) => callback(null, true),
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  _io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return _io;
};

const getIO = () => {
  if (!_io) {
    throw new Error('Socket.IO not initialised. Call socket.init(httpServer) first.');
  }
  return _io;
};

module.exports = { init, getIO };
