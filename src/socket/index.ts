import io from "socket.io-client";

export function intializeSocket() {
  return io();
}
