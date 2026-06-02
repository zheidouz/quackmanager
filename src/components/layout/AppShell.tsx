import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { initSyncEngine } from '../../sync/syncEngine';
import { useOnlineStatus } from '../../sync/useOnlineStatus';
import SyncIndicator from '../feedback/SyncIndicator';

type Tab = {
  path: string;
  label: string;
  icon: string;
};

const tabs: Tab[] = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/production', label: 'Production', icon: 'egg' },
  { path: '/sales', label: 'Sales', icon: 'payments' },
  { path: '/expenses', label: 'Expenses', icon: 'receipt_long' },
  { path: '/reports', label: 'Reports', icon: 'bar_chart' },
];

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  useOnlineStatus();

  // Initialize the sync engine when the app shell mounts (user is authenticated)
  useEffect(() => {
    const cleanup = initSyncEngine();
    return cleanup;
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-primary text-white">
        <h1 className="text-lg font-semibold">QuackManager</h1>
        <SyncIndicator />
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-surface px-4 py-4">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="flex items-center justify-around bg-white border-t border-gray-200 pt-1 pb-2 safe-area-bottom" style={{ minHeight: 56 }}>
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center px-3 py-1 min-w-touch min-h-touch ${
              isActive(tab.path) ? 'tab-active' : 'tab-inactive'
            }`}
            aria-label={tab.label}
            aria-current={isActive(tab.path) ? 'page' : undefined}
          >
            <span className="material-symbols-outlined text-2xl">{tab.icon}</span>
            <span className="text-xs mt-0.5">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
