const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Board = require('../models/Board');

const canvasStates = new Map(); // Store canvas states for different whiteboards
const socketRoomMap = new Map(); // Map of socket ID to room and user ID

module.exports = (io, socket) => {
  // Join a specific whiteboard room
  socket.on('joinWhiteboard', async ({ whiteboardId, userId }) => {
    if (whiteboardId && userId) {
      socket.join(whiteboardId);
      console.log(`Socket ${socket.id} joined whiteboard ${whiteboardId}`);
      socket.userId = userId; // Set socket.userId

      // Store the mapping of socket ID to room and user ID
      socketRoomMap.set(socket.id, { whiteboardId, userId });

      // Add user to the whiteboard's members array if not already present
      const whiteboard = await Board.findById(whiteboardId);
      const userExists = whiteboard.members.some(member => member.memberId.equals(userId));
      if (!userExists) {
        whiteboard.members.push({ memberId: userId });
        await whiteboard.save();
      }

      // Get user information
      const user = await User.findById(userId);
      if (user) {
        socket.to(whiteboardId).emit('userJoined', `${user.username} has joined the whiteboard.`);
      }
    } else {
      console.error('Whiteboard ID and User ID are required to join a room.');
    }
  });

  // Send canvas state to the requester only
  socket.on('getCanvasState', (whiteboardId) => {
    const state = canvasStates.get(whiteboardId);
    if (state) {
      socket.emit('canvasState', state);
    }
  });

  // Update canvas state and notify all clients in the specific whiteboard
  socket.on('updateCanvasState', ({ state, whiteboard }) => {
    canvasStates.set(whiteboard, state);
    socket.to(whiteboard).emit('canvasState', state);
  });

  // Handle cursor movement within a specific whiteboard
  socket.on('cursorMove', ({ whiteboard, ...data }) => {
    socket.to(whiteboard).emit('cursorMove', data);
  });

  // Handle drawing events within a specific whiteboard
  socket.on('draw', ({ whiteboard, ...data }) => {
    socket.to(whiteboard).emit('draw', data);
  });

  // Notify when a user disconnects and update their lastAccessedAt
  socket.on('disconnectUser', async (id) => {
    socket.leave(id);
    const socketData = socketRoomMap.get(socket.id);
    if (!socketData) return; // If no mapping found, return

    const { whiteboardId, userId } = socketData;
    console.log(`Socket ${socket.id} disconnecting from whiteboard ${whiteboardId}`);

    // Update the last accessed time for the user
    const whiteboard = await Board.findById(whiteboardId);
    if (whiteboard) {
      const member = whiteboard.members.find(m => m.memberId.equals(userId));
      if (member) {
        member.lastAccessedAt = new Date();
        await whiteboard.save();
      }

      // Check if the room is now empty
      const clients = io.sockets.adapter.rooms.get(whiteboardId);
      if (!clients || clients.size === 0) {
        console.log(`Room ${whiteboardId} is empty. Storing canvas state.`);
        // Store the canvas state in the whiteboard document
        const state = canvasStates.get(whiteboardId);
        if (state) {
          whiteboard.boardElements = state;
          await whiteboard.save();
          canvasStates.delete(whiteboardId); // Clear the state from the map
        }

        // Get user information and notify them
        const user = await User.findById(userId);
        if (user) {
          io.to(socket.id).emit('roomClosed', 'The whiteboard room is empty. Closing whiteboard and uploading state and user details to the database.');
        }
      } else {
        // Get user information
        const user = await User.findById(userId);
        if (user) {
          socket.to(whiteboardId).emit('userLeft', `${user.username} has left the whiteboard.`);
        }
      }
    }

    // Remove from socketRoomMap
    socketRoomMap.delete(socket.id);
  });

    // Notify when a user disconnects and update their lastAccessedAt
  socket.on('disconnect', async () => {
    const socketData = socketRoomMap.get(socket.id);
    if (!socketData) return; // If no mapping found, return

    const { whiteboardId, userId } = socketData;
    console.log(`Socket ${socket.id} disconnecting from whiteboard ${whiteboardId}`);

    // Update the last accessed time for the user
    const whiteboard = await Board.findById(whiteboardId);
    if (whiteboard) {
      const member = whiteboard.members.find(m => m.memberId.equals(userId));
      if (member) {
        member.lastAccessedAt = new Date();
        await whiteboard.save();
      }

      // Check if the room is now empty
      const clients = io.sockets.adapter.rooms.get(whiteboardId);
      if (!clients || clients.size === 0) {
        console.log(`Room ${whiteboardId} is empty. Storing canvas state.`);
        // Store the canvas state in the whiteboard document
        const state = canvasStates.get(whiteboardId);
        if (state) {
          whiteboard.boardElements = state;
          await whiteboard.save();
          canvasStates.delete(whiteboardId); // Clear the state from the map
        }

        // Get user information and notify them
        const user = await User.findById(userId);
        if (user) {
          io.to(socket.id).emit('roomClosed', 'The whiteboard room is empty. Closing whiteboard and uploading state and user details to the database.');
        }
      } else {
        // Get user information
        const user = await User.findById(userId);
        if (user) {
          socket.to(whiteboardId).emit('userLeft', `${user.username} has left the whiteboard.`);
        }
      }
    }

    // Remove from socketRoomMap
    socketRoomMap.delete(socket.id);
  });
};
