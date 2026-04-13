import { io } from 'socket.io-client';

/**
 * Socket.io client instance
 * - Production: kết nối trực tiếp tới backend (VITE_API_URL)
 * - Development: kết nối qua cùng origin (Vite proxy)
 * - autoConnect: false → chỉ kết nối khi cần (staff dashboard)
 */
const SOCKET_URL = import.meta.env.VITE_API_URL || '';

const socket = io(SOCKET_URL || undefined, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
