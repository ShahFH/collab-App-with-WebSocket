import { SOCKET_CONFIG } from '../config/constants';

export const getSocketConfig = () => {
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  const wsUrl = `${protocol}//${window.location.hostname}:${SOCKET_CONFIG.PORT}`;
  
  return {
    url: wsUrl,
    options: {
      reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
      reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
      transports: ['websocket', 'polling'],
    },
  };
};