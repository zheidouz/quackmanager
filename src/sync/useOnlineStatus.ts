import { useState, useEffect } from 'react';
import { useSyncStore } from './syncStore';

/**
 * Hook that tracks online/offline connectivity status.
 * Updates the sync store when connectivity changes.
 * Listens for window online/offline events.
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);
  const setOnlineInStore = useSyncStore((s) => s.setOnline);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setOnlineInStore(true);
    };
    const handleOffline = () => {
      setOnline(false);
      setOnlineInStore(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineInStore]);

  return online;
}
