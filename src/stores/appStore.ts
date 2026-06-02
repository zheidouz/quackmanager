import { create } from 'zustand';

interface AppState {
  todayDate: string;
  syncStatus: 'synced' | 'pending' | 'error' | 'offline';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSyncStatus: (status: AppState['syncStatus']) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  todayDate: new Date().toISOString().split('T')[0],
  syncStatus: 'offline',
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSyncStatus: (status) => set({ syncStatus: status }),
}));
