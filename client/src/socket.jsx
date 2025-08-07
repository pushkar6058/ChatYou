import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

// It's convention to capitalize the context variable as well
const SocketContext = createContext();

// Custom hooks should start with 'use'
const useSocket = () => useContext(SocketContext);

// COMPONENT NAME MUST BE CAPITALIZED
const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () => io("http://localhost:3000", { withCredentials: true }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>
        {children}
        </SocketContext.Provider>
  );
};

export {useSocket,SocketProvider};


