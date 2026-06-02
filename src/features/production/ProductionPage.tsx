import { useSearchParams } from 'react-router-dom';
import EggCollectionForm from './EggCollectionForm';
import IncubationTab from './IncubationTab';
import DucklingTab from './DucklingTab';

type ProductionTab = 'eggs' | 'incubation' | 'ducklings';

const tabs: { id: ProductionTab; label: string; icon: string }[] = [
  { id: 'eggs', label: 'Egg Collection', icon: 'egg' },
  { id: 'incubation', label: 'Incubation', icon: 'heat' },
  { id: 'ducklings', label: 'Ducklings', icon: 'pets' },
];

export default function ProductionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: ProductionTab = (searchParams.get('tab') as ProductionTab) || 'eggs';

  const setActiveTab = (tab: ProductionTab) => {
    setSearchParams({ tab });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Production</h2>

      {/* Tab bar */}
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
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'eggs' && <EggCollectionForm />}
      {activeTab === 'incubation' && <IncubationTab />}
      {activeTab === 'ducklings' && <DucklingTab />}
    </div>
  );
}
