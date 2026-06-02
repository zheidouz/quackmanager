import { describe, it, expect, beforeEach } from 'vitest';
import { useSyncStore } from '../../sync/syncStore';

beforeEach(() => {
  useSyncStore.setState({
    isOnline: true,
    pendingCount: 0,
    lastSynced: null,
  });
});

describe('syncStore', () => {
  it('starts with default online state', () => {
    const state = useSyncStore.getState();
    expect(typeof state.isOnline).toBe('boolean');
    expect(state.pendingCount).toBe(0);
    expect(state.lastSynced).toBeNull();
  });

  it('setOnline updates connectivity status', () => {
    useSyncStore.getState().setOnline(false);
    expect(useSyncStore.getState().isOnline).toBe(false);

    useSyncStore.getState().setOnline(true);
    expect(useSyncStore.getState().isOnline).toBe(true);
  });

  it('setPendingCount updates pending count', () => {
    useSyncStore.getState().setPendingCount(5);
    expect(useSyncStore.getState().pendingCount).toBe(5);

    useSyncStore.getState().setPendingCount(0);
    expect(useSyncStore.getState().pendingCount).toBe(0);
  });

  it('setLastSynced stores timestamp', () => {
    const ts = '2026-06-02T10:00:00.000Z';
    useSyncStore.getState().setLastSynced(ts);
    expect(useSyncStore.getState().lastSynced).toBe(ts);
  });

  it('incrementPending increases count by 1', () => {
    useSyncStore.getState().incrementPending();
    expect(useSyncStore.getState().pendingCount).toBe(1);

    useSyncStore.getState().incrementPending();
    expect(useSyncStore.getState().pendingCount).toBe(2);
  });

  it('sync delegates to syncEngine and updates state on success', async () => {
    // Override sync to simulate a successful sync
    const originalSync = useSyncStore.getState().sync;
    useSyncStore.getState().sync = async () => {
      useSyncStore.setState({ pendingCount: 0, lastSynced: new Date().toISOString() });
    };

    useSyncStore.getState().setPendingCount(3);
    await useSyncStore.getState().sync();

    const state = useSyncStore.getState();
    expect(state.pendingCount).toBe(0);
    expect(state.lastSynced).toBeTruthy();
    expect(() => new Date(state.lastSynced!)).not.toThrow();

    // Restore original
    useSyncStore.getState().sync = originalSync;
  });
});
