import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const serverUrlRef = useRef(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

  useEffect(() => {
    let newSocketInstance = null;

    if (user) {
      newSocketInstance = io(serverUrlRef.current, {
        withCredentials: true,
      });

      newSocketInstance.on('connect', () => {
        console.log('Socket connected:', newSocketInstance.id);
        newSocketInstance.emit('setup', user._id);
      });

      newSocketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      newSocketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      setSocket(newSocketInstance);

    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }

    return () => {
      if (newSocketInstance) {
        console.log('Closing socket connection...');
        newSocketInstance.close();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
