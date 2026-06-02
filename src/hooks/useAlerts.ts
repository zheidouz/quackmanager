import { useCallback, useEffect } from 'react';
import { useAlertStore } from '../stores/alertStore';
import { useFeedInventory } from './useFeedInventory';
import { useIncubationBatches } from './useProduction';
import { useExpenses } from './useExpenses';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook that generates alerts based on app state:
 * - Low feed stock alerts
 * - Incubation hatch reminders
 * - Recurring expense processing
 */
export function useAlerts() {
  const { isAuthenticated } = useAuthStore();
  const { stock, isLow: isFeedLow } = useFeedInventory();
  const { batches } = useIncubationBatches();
  const { processRecurringExpenses } = useExpenses();
  const { addAlert, dismissAlert, alerts } = useAlertStore();

  const generateAlerts = useCallback(async () => {
    if (!isAuthenticated) return;

    const today = new Date().toISOString().split('T')[0];

    // 1. Low feed stock alert
    if (isFeedLow && stock) {
      const existing = alerts.find((a) => a.id === 'alert-low-feed' && !a.dismissed);
      if (!existing) {
        addAlert({
          id: 'alert-low-feed',
          type: 'warning',
          title: 'Low Feed Stock',
          message: `Current stock: ${stock.currentStockKg} kg. Consider ordering more feed soon.`,
        });
      }
    }

    // 2. Incubation hatch reminders (1-2 days before)
    for (const batch of batches) {
      if (batch.expectedHatchDate) {
        const hatchDate = new Date(batch.expectedHatchDate + 'T00:00:00');
        const now = new Date(today + 'T00:00:00');
        const diffMs = hatchDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 2) {
          const alertId = `alert-hatch-${batch.id}`;
          const existing = alerts.find((a) => a.id === alertId && !a.dismissed);
          if (!existing) {
            addAlert({
              id: alertId,
              type: 'info',
              title: 'Hatch Reminder',
              message: `Batch from ${batch.datePlaced} (${batch.quantity} eggs) expected to hatch ${diffDays === 0 ? 'today' : `in ${diffDays} day${diffDays > 1 ? 's' : ''}`}.`,
            });
          }
        }
      }
    }

    // 3. Process recurring expenses
    try {
      await processRecurringExpenses(today);
    } catch (err) {
      console.error('Failed to process recurring expenses:', err);
    }
  }, [isAuthenticated, isFeedLow, stock, batches, alerts, addAlert, processRecurringExpenses]);

  // Run on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      generateAlerts();
    }
  }, [isAuthenticated, generateAlerts]);

  const activeAlerts = alerts.filter((a) => !a.dismissed);

  return { alerts: activeAlerts, dismissAlert, refreshAlerts: generateAlerts };
}
