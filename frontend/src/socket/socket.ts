import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_FOODIE_URL || 'http://localhost:9000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 50
});

export default socket;
