// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import io, {Socket} from 'socket.io-client';

// // Define a type alias for socket
// type SocketType = Socket | null;

// // Define the context type
// interface SocketContextType {
//   socket: SocketType;
// }


// interface SocketProviderProps {
//   children: ReactNode;
// }

// // Create the Socket context
// const SocketContext = createContext<SocketContextType | undefined>(undefined);

// // Create the SocketProvider
// export const SocketProvider = ({ children }: SocketProviderProps) => {
//   const [socket, setSocket] = useState<SocketType>(null);

//   useEffect(() => {
//     // Initialize socket connection
//     const socketInstance: SocketType = io('http://localhost:5173');
//     setSocket(socketInstance);

//     // Cleanup on unmount
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ socket }},
//       {children}
//     </SocketContext.Provider>
//   );
// };

// // Custom hook to use socket context
// export const useSocket = (): SocketContextType => {
//   const context = useContext(SocketContext);

//   if (!context) {
//     throw new Error('useSocket must be used within a SocketProvider');
//   }

//   return context;
// };

// export default SocketContext;
