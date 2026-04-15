import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let socket = null;

/**
 * Get (or create) the shared Socket.IO client instance.
 * Connects lazily on first call so pages that don't need the socket
 * never open a connection.
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

/**
 * Disconnect and dispose of the shared socket instance.
 */
export const destroySocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
