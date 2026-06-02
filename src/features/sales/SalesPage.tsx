import { useSearchParams } from 'react-router-dom';
import EggSalesTab from './EggSalesTab';
import DuckSalesTab from './DuckSalesTab';
import FeedInventoryTab from './FeedInventoryTab';
import CustomersTab from './CustomersTab';

type SalesTab = 'egg-sales' | 'duck-sales' | 'feed' | 'customers';

const tabs: { id: SalesTab; label: string; icon: string }[] = [
  { id: 'egg-sales', label: 'Egg Sales', icon: 'egg' },
  { id: 'duck-sales', label: 'Duck Sales', icon: 'pets' },
  { id: 'feed', label: 'Feed', icon: 'bakery_dining' },
  { id: 'customers', label: 'Customers', icon: 'people' },
];

export default function SalesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: SalesTab = (searchParams.get('tab') as SalesTab) || 'egg-sales';

  const setActiveTab = (tab: SalesTab) => {
    setSearchParams({ tab });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales & Inventory</h2>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md text-sm font-medium transition-colors min-h-touch whitespace-nowrap ${
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

      {/* Tab content */}
      {activeTab === 'egg-sales' && <EggSalesTab />}
      {activeTab === 'duck-sales' && <DuckSalesTab />}
      {activeTab === 'feed' && <FeedInventoryTab />}
      {activeTab === 'customers' && <CustomersTab />}
    </div>
  );
}
