import { useSearchParams } from 'react-router-dom';
import DailyLogTab from './DailyLogTab';
import ProfitLossTab from './ProfitLossTab';

type ReportsTab = 'daily-log' | 'profit-loss';

const tabs: { id: ReportsTab; label: string; icon: string }[] = [
  { id: 'daily-log', label: 'Daily Log', icon: 'assignment' },
  { id: 'profit-loss', label: 'Profit & Loss', icon: 'bar_chart' },
];

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: ReportsTab = (searchParams.get('tab') as ReportsTab) || 'daily-log';

  const setActiveTab = (tab: ReportsTab) => {
    setSearchParams({ tab });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports</h2>

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-md text-sm font-medium transition-colors min-h-touch ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            <span className="text-xs sm:text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'daily-log' && <DailyLogTab />}
      {activeTab === 'profit-loss' && <ProfitLossTab />}
    </div>
  );
}
