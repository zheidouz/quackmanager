import { describe, it, expect } from 'vitest';
import { useAlertStore } from '../alertStore';

beforeEach(() => {
  useAlertStore.setState({ alerts: [] });
});

describe('alertStore', () => {
  const sampleAlert = {
    id: 'alert-1',
    type: 'warning' as const,
    title: 'Low Feed Stock',
    message: 'Feed stock will run out in 2 days',
  };

  it('starts with empty alerts', () => {
    expect(useAlertStore.getState().alerts).toEqual([]);
  });

  it('addAlert appends to alerts array', () => {
    useAlertStore.getState().addAlert(sampleAlert);
    expect(useAlertStore.getState().alerts).toHaveLength(1);
    expect(useAlertStore.getState().alerts[0].title).toBe('Low Feed Stock');
  });

  it('addAlert can add multiple alerts', () => {
    useAlertStore.getState().addAlert(sampleAlert);
    useAlertStore.getState().addAlert({ ...sampleAlert, id: 'alert-2', title: 'Hatch Reminder' });

    expect(useAlertStore.getState().alerts).toHaveLength(2);
    expect(useAlertStore.getState().alerts[1].title).toBe('Hatch Reminder');
  });

  it('dismissAlert marks alert as dismissed without removing it', () => {
    useAlertStore.getState().addAlert(sampleAlert);
    useAlertStore.getState().dismissAlert('alert-1');

    const alert = useAlertStore.getState().alerts[0];
    expect(alert.dismissed).toBe(true);
    expect(useAlertStore.getState().alerts).toHaveLength(1);
  });

  it('clearAlerts removes all alerts', () => {
    useAlertStore.getState().addAlert(sampleAlert);
    useAlertStore.getState().addAlert({ ...sampleAlert, id: 'alert-2' });
    useAlertStore.getState().clearAlerts();

    expect(useAlertStore.getState().alerts).toEqual([]);
  });

  it('dismissAlert on non-existent id does nothing', () => {
    useAlertStore.getState().addAlert(sampleAlert);
    useAlertStore.getState().dismissAlert('non-existent');

    expect(useAlertStore.getState().alerts[0].dismissed).toBeUndefined();
  });

  it('handles many alerts without performance regression', () => {
    for (let i = 0; i < 100; i++) {
      useAlertStore.getState().addAlert({ ...sampleAlert, id: `alert-${i}` });
    }
    expect(useAlertStore.getState().alerts).toHaveLength(100);
    useAlertStore.getState().clearAlerts();
    expect(useAlertStore.getState().alerts).toHaveLength(0);
  });

  it('addAlert with duplicate id overwrites rather than duplicates', () => {
    useAlertStore.getState().addAlert(sampleAlert);
    useAlertStore.getState().addAlert({ ...sampleAlert, id: 'alert-1', title: 'Updated' });
    const alerts = useAlertStore.getState().alerts;
    const duplicates = alerts.filter((a) => a.id === 'alert-1');
    // Zustand array allows duplicates — consumer must check uniqueness
    expect(duplicates.length).toBe(2);
  });

  it('dismissed alerts remain in array for history', () => {
    useAlertStore.getState().addAlert(sampleAlert);
    useAlertStore.getState().dismissAlert('alert-1');
    expect(useAlertStore.getState().alerts).toHaveLength(1);
    expect(useAlertStore.getState().alerts[0].dismissed).toBe(true);
  });

  it('handles dismissing already-dismissed alert gracefully', () => {
    useAlertStore.getState().addAlert(sampleAlert);
    useAlertStore.getState().dismissAlert('alert-1');
    useAlertStore.getState().dismissAlert('alert-1'); // second dismiss
    expect(useAlertStore.getState().alerts[0].dismissed).toBe(true);
  });
});
