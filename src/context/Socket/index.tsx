import { useState, createContext } from "react";
import { Socket } from "socket.io-client";

export const SocketContext = createContext<{
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}>({
  socket: null,
  setSocket: () => {},
});

const SocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  console.log(socket);
  

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;