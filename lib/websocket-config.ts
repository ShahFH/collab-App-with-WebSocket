'use client';

export const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  const wsPort = process.env.NEXT_PUBLIC_WS_PORT || '3001';
  return `${protocol}//${host}:${wsPort}/ws`;
};