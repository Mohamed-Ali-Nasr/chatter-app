import { io } from "socket.io-client";

export const socket = io(String(import.meta.env.VITE_BASE_URL));

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
