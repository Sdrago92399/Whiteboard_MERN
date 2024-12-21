const { Server } = require('socket.io');
const http = require('http');

const liveSocketController = require('../controllers/liveSocketController');
let io;

const initializeIo = (app, corsOptions) => {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: corsOptions,
  });

  io.on('connection', (socket) => {
    // console.log("New client connected");
    liveSocketController(io, socket);
  });

  io.on('disconnect', () => {
    // console.log('Client disconnected');
  });

  return server;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeIo, getIo };
