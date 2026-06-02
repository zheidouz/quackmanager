interface EmptyStateProps {
  icon: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">{icon}</span>
      <p className="text-base font-medium text-gray-700 mb-1">{title}</p>
      {message && <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">{message}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary flex items-center gap-2" aria-label={actionLabel}>
          <span className="material-symbols-outlined text-lg">add</span>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
