import { useSyncStore } from '../../sync/syncStore';

export default function SyncIndicator() {
  const { isOnline, pendingCount, lastSynced } = useSyncStore();

  const getStatus = () => {
    if (!isOnline) return { color: 'bg-yellow-500', text: 'Offline' };
    if (pendingCount > 0) return { color: 'bg-yellow-500', text: `Syncing ${pendingCount}...` };
    return { color: 'bg-green-500', text: lastSynced ? 'Synced' : 'Connected' };
  };

  const status = getStatus();

  return (
    <div className="flex items-center gap-1.5" title={`${status.text}${lastSynced ? ` — Last: ${new Date(lastSynced).toLocaleTimeString()}` : ''}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${status.color}`} />
      <span className="text-xs opacity-90">{status.text}</span>
    </div>
  );
}
