import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: { uid: string; email: string | null; displayName: string | null } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: { uid: string; email: string | null; displayName: string | null }) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: 'quackmanager-auth' }
  )
);
