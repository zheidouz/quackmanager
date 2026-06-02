import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEggCollection } from '../../hooks/useEggCollection';

export default function EggCollectionForm() {
  const navigate = useNavigate();
  const { todayEntry, recentEntries, isLoading, saveEntry, todayDate } = useEggCollection();

  const [date, setDate] = useState(todayDate);
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepperRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pre-fill if editing today's entry
  useEffect(() => {
    if (todayEntry) {
      setDate(todayEntry.date);
      setQuantity(todayEntry.quantity);
      setNotes(todayEntry.notes ?? '');
    } else {
      setDate(todayDate);
      setQuantity(0);
      setNotes('');
    }
  }, [todayEntry, todayDate]);

  const clearForm = useCallback(() => {
    setQuantity(0);
    setNotes('');
    setDate(todayDate);
    setSaved(false);
    setError(null);
  }, [todayDate]);

  const handleSave = async () => {
    if (quantity < 0) {
      setError('Egg count cannot be negative');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const entry = await saveEntry({ date, quantity, notes: notes.trim() || undefined });

      if (entry) {
        setSaved(true);
        // Haptic feedback (iOS supports this)
        if (navigator.vibrate) navigator.vibrate(50);
      }
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Stepper handlers with long-press support
  const startLongPress = (direction: 'up' | 'down') => {
    const step = direction === 'up' ? 10 : -10;
    longPressTimer.current = setTimeout(() => {
      longPressInterval.current = setInterval(() => {
        setQuantity((prev) => Math.max(0, Math.min(9999, prev + step)));
      }, 200);
    }, 500);
  };

  const stopLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (longPressInterval.current) {
      clearInterval(longPressInterval.current);
      longPressInterval.current = null;
    }
  };

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (longPressInterval.current) clearInterval(longPressInterval.current);
    };
  }, []);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded-lg w-3/4" />
        <div className="h-16 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded-lg w-1/2" />
        <div className="h-14 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl text-green-600">check</span>
        </div>
        <p className="text-lg font-semibold text-gray-900 mb-1">Saved!</p>
        <p className="text-sm text-gray-500 mb-6">{quantity} eggs recorded</p>

        <div className="w-full space-y-3">
          <button
            onClick={clearForm}
            className="btn-primary w-full flex items-center justify-center gap-2"
            aria-label="Record another egg collection"
          >
            <span className="material-symbols-outlined">edit_note</span>
            Record Another
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary w-full flex items-center justify-center gap-2"
            aria-label="Go back to dashboard"
          >
            <span className="material-symbols-outlined">home</span>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Date picker */}
      <div className="mb-4">
        <label htmlFor="egg-date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          id="egg-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={todayDate}
          className="input-field"
          aria-label="Collection date"
        />
      </div>

      {/* Egg Count Stepper */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Egg Count
        </label>
        <div
          ref={stepperRef}
          className="flex items-center justify-center gap-4"
          role="group"
          aria-label="Egg count stepper"
        >
          {/* Decrease button */}
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
            onMouseDown={() => startLongPress('down')}
            onMouseUp={stopLongPress}
            onMouseLeave={stopLongPress}
            onTouchStart={() => startLongPress('down')}
            onTouchEnd={stopLongPress}
            className="w-14 h-14 rounded-full bg-gray-100 active:bg-gray-200 
                       flex items-center justify-center transition-colors
                       text-gray-700 text-3xl font-bold select-none"
            aria-label="Decrease egg count"
            disabled={quantity <= 0}
          >
            −
          </button>

          {/* Count display */}
          <div
            className="text-5xl font-bold text-gray-900 tabular-nums min-w-[100px] text-center"
            aria-live="polite"
            aria-atomic="true"
            role="status"
          >
            {quantity}
          </div>

          {/* Increase button */}
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.min(9999, prev + 1))}
            onMouseDown={() => startLongPress('up')}
            onMouseUp={stopLongPress}
            onMouseLeave={stopLongPress}
            onTouchStart={() => startLongPress('up')}
            onTouchEnd={stopLongPress}
            className="w-14 h-14 rounded-full bg-primary text-white 
                       active:bg-primary-600 flex items-center justify-center transition-colors
                       text-3xl font-bold select-none"
            aria-label="Increase egg count"
            disabled={quantity >= 9999}
          >
            +
          </button>
        </div>
      </div>

      {/* Notes (optional) */}
      <div className="mb-6">
        <label htmlFor="egg-notes" className="block text-sm font-medium text-gray-500 mb-1">
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="egg-notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Few extra-small today"
          className="input-field text-sm"
          maxLength={200}
          aria-label="Optional notes about this collection"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
        aria-label="Save egg collection"
      >
        {isSaving ? (
          <>
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">save</span>
            {todayEntry ? 'Update Egg Collection' : 'Save Egg Collection'}
          </>
        )}
      </button>

      {/* Recent 7 days reference */}
      {recentEntries.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-medium text-gray-500 mb-2">Last 7 Days</p>
          <div className="space-y-1.5">
            {recentEntries.slice(0, 7).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2"
              >
                <span className="text-gray-500">{formatDate(entry.date)}</span>
                <span className="font-semibold text-gray-900">{entry.quantity} eggs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
