import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SyncIndicator from '../SyncIndicator';
import { useSyncStore } from '../../../sync/syncStore';

beforeEach(() => {
  useSyncStore.setState({
    isOnline: true,
    pendingCount: 0,
    lastSynced: null,
  });
});

describe('SyncIndicator', () => {
  it('displays "Connected" when online with no pending items', () => {
    render(<SyncIndicator />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('displays "Synced" when lastSynced is set', () => {
    useSyncStore.setState({ lastSynced: '2026-06-02T10:00:00.000Z' });
    render(<SyncIndicator />);
    expect(screen.getByText('Synced')).toBeInTheDocument();
  });

  it('displays "Offline" when not online', () => {
    useSyncStore.setState({ isOnline: false });
    render(<SyncIndicator />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('displays pending count when items need syncing', () => {
    useSyncStore.setState({ pendingCount: 3 });
    render(<SyncIndicator />);
    expect(screen.getByText('Syncing 3...')).toBeInTheDocument();
  });
});
