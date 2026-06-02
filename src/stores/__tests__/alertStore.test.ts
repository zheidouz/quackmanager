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
});
