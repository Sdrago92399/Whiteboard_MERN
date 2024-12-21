import { createSlice } from '@reduxjs/toolkit';
import socketIOClient from 'socket.io-client';
import axiosInstance from '@/api/axios';

const ENDPOINT = axiosInstance.getUri().substring(0, axiosInstance.getUri().length - 5);

export const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
  },
  reducers: {
    initializeSocket: (state) => {
      if (!state.socket) {
        state.socket = socketIOClient(ENDPOINT);
      }
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
  },
});

export const { initializeSocket, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
