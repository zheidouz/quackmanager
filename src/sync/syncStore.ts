import { create } from 'zustand';

interface SyncState {
  isOnline: boolean;
  pendingCount: number;
  lastSynced: string | null;
  setOnline: (online: boolean) => void;
  setPendingCount: (count: number) => void;
  incrementPending: () => void;
  setLastSynced: (timestamp: string) => void;
  sync: () => Promise<void>;
}

export const useSyncStore = create<SyncState>()((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingCount: 0,
  lastSynced: null,
  setOnline: (online) => set({ isOnline: online }),
  setPendingCount: (count) => set({ pendingCount: count }),
  incrementPending: () => set((state) => ({ pendingCount: state.pendingCount + 1 })),
  setLastSynced: (timestamp) => set({ lastSynced: timestamp }),
  sync: async () => {
    // Delegate to the real sync engine
    const { runSync } = await import('./syncEngine');
    await runSync('push');
  },
}));
