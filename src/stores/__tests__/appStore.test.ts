import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../appStore';

beforeEach(() => {
  useAppStore.setState({
    todayDate: new Date().toISOString().split('T')[0],
    syncStatus: 'offline',
    activeTab: 'home',
  });
});

describe('appStore', () => {
  it('starts with todays date and offline sync status', () => {
    const state = useAppStore.getState();
    expect(state.todayDate).toBe(new Date().toISOString().split('T')[0]);
    expect(state.syncStatus).toBe('offline');
    expect(state.activeTab).toBe('home');
  });

  it('setActiveTab updates active tab', () => {
    useAppStore.getState().setActiveTab('production');
    expect(useAppStore.getState().activeTab).toBe('production');
  });

  it('setSyncStatus updates sync status', () => {
    useAppStore.getState().setSyncStatus('synced');
    expect(useAppStore.getState().syncStatus).toBe('synced');

    useAppStore.getState().setSyncStatus('error');
    expect(useAppStore.getState().syncStatus).toBe('error');

    useAppStore.getState().setSyncStatus('pending');
    expect(useAppStore.getState().syncStatus).toBe('pending');
  });

  it('supports all sync status values', () => {
    const statuses = ['synced', 'pending', 'error', 'offline'] as const;
    for (const status of statuses) {
      useAppStore.getState().setSyncStatus(status);
      expect(useAppStore.getState().syncStatus).toBe(status);
    }
  });
});
