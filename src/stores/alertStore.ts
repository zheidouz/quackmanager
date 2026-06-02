import { create } from 'zustand';

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'error';
  title: string;
  message: string;
  dismissed?: boolean;
}

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  dismissAlert: (id: string) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertState>()((set) => ({
  alerts: [],
  addAlert: (alert) => set((state) => {
    // Keep max 100 alerts to prevent unbounded memory growth
    const updated = [...state.alerts, alert];
    return { alerts: updated.slice(-100) };
  }),
  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, dismissed: true } : a)),
    })),
  clearAlerts: () => set({ alerts: [] }),
}));
