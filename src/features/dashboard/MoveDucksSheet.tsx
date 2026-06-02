import { useState, useEffect } from 'react';
import { DUCK_AGE_GROUP_LABELS, type DuckAgeGroup } from '../../types/models';

interface MoveDucksSheetProps {
  open: boolean;
  ducklings: number;
  growers: number;
  adults: number;
  onMove: (fromGroup: DuckAgeGroup, toGroup: DuckAgeGroup, quantity: number) => Promise<void>;
  onClose: () => void;
}

const ageGroups: DuckAgeGroup[] = ['duckling', 'grower', 'adult'];

export default function MoveDucksSheet({ open, ducklings, growers, adults, onMove, onClose }: MoveDucksSheetProps) {
  const [fromGroup, setFromGroup] = useState<DuckAgeGroup>('duckling');
  const [toGroup, setToGroup] = useState<DuckAgeGroup>('grower');
  const [quantity, setQuantity] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFromGroup('duckling');
      setToGroup('grower');
      setQuantity(0);
      setError(null);
    }
  }, [open]);

  const groupCounts: Record<DuckAgeGroup, number> = { duckling: ducklings, grower: growers, adult: adults };

  const getAvailableGroups = (selected: DuckAgeGroup): DuckAgeGroup[] =>
    ageGroups.filter((g) => g !== selected && groupCounts[g] >= 0);

  const handleMove = async () => {
    setError(null);
    if (quantity <= 0) { setError('Quantity must be greater than 0'); return; }
    if (fromGroup === toGroup) { setError('Source and target must be different'); return; }
    const available = groupCounts[fromGroup];
    if (quantity > available) {
      setError(`Only ${available} ducks available in ${DUCK_AGE_GROUP_LABELS[fromGroup]}`);
      return;
    }
    setIsMoving(true);
    try {
      await onMove(fromGroup, toGroup, quantity);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Move failed');
    } finally {
      setIsMoving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Move ducks between age groups"
    >
      <div
        className="bg-white rounded-t-2xl w-full max-w-lg mx-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Move Ducks</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 min-w-touch min-h-touch flex items-center justify-center" aria-label="Close">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* From */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-500 mb-1 block">From</label>
          <div className="flex gap-2">
            {ageGroups.map((g) => {
              const disabled = g === toGroup || groupCounts[g] === 0;
              return (
                <button
                  key={g}
                  onClick={() => setFromGroup(g)}
                  disabled={disabled}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors min-h-touch ${
                    fromGroup === g
                      ? 'bg-primary text-white'
                      : disabled
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                  }`}
                >
                  {DUCK_AGE_GROUP_LABELS[g]}
                  <span className="block text-xs mt-0.5 opacity-70">{groupCounts[g]} available</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-4">
          <span className="material-symbols-outlined text-2xl text-gray-400">arrow_downward</span>
        </div>

        {/* To */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-500 mb-1 block">To</label>
          <div className="flex gap-2">
            {getAvailableGroups(fromGroup).map((g) => (
              <button
                key={g}
                onClick={() => setToGroup(g)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors min-h-touch ${
                  toGroup === g
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >
                {DUCK_AGE_GROUP_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-5">
          <label htmlFor="move-qty" className="text-xs font-medium text-gray-500 mb-1 block">
            Number of Ducks
          </label>
          <input
            id="move-qty"
            type="number"
            inputMode="numeric"
            min={1}
            max={groupCounts[fromGroup]}
            step={1}
            value={quantity || ''}
            onChange={(e) => setQuantity(Math.max(0, Math.floor(Number(e.target.value)) || 0))}
            className="input-field text-sm"
            placeholder={`Max ${groupCounts[fromGroup]}`}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">Cancel</button>
          <button
            onClick={handleMove}
            disabled={isMoving || quantity <= 0 || fromGroup === toGroup}
            className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
          >
            {isMoving ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Moving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">swap_horiz</span>
                Move {quantity} Ducks
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
