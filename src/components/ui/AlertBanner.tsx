interface AlertBannerProps {
  type: 'warning' | 'info' | 'error';
  title: string;
  message?: string;
  onDismiss?: () => void;
}

const styles = {
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    icon: 'warning',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    textColor: 'text-yellow-700',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'info',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: 'error',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
  },
};

export default function AlertBanner({ type, title, message, onDismiss }: AlertBannerProps) {
  const s = styles[type];

  return (
    <div className={`border rounded-lg p-3 mb-4 ${s.bg}`} role="alert">
      <div className="flex items-start gap-2">
        <span className={`material-symbols-outlined text-lg mt-0.5 ${s.iconColor}`}>{s.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${s.titleColor}`}>{title}</p>
          {message && <p className={`text-xs mt-0.5 ${s.textColor}`}>{message}</p>}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${s.iconColor} hover:opacity-70 transition-opacity min-w-touch min-h-touch flex items-center justify-center`}
            aria-label="Dismiss alert"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
