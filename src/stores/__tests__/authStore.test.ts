import { describe, it, expect } from 'vitest';
import { useAuthStore } from '../authStore';

// Reset store between tests
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
});

describe('authStore', () => {
  it('starts with no user and loading state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it('login sets user and marks authenticated', () => {
    const user = { uid: 'abc123', email: 'farmer@duckfarm.com', displayName: 'Farmer Duck' };
    useAuthStore.getState().login(user);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('logout clears user and resets auth state', () => {
    // Login first
    useAuthStore.getState().login({ uid: 'abc', email: 'a@b.com', displayName: 'Test' });
    // Then logout
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('setLoading updates loading state', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);

    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it('handles login with null email and displayName', () => {
    useAuthStore.getState().login({ uid: 'xyz', email: null, displayName: null });

    const state = useAuthStore.getState();
    expect(state.user).toEqual({ uid: 'xyz', email: null, displayName: null });
    expect(state.isAuthenticated).toBe(true);
  });
});
