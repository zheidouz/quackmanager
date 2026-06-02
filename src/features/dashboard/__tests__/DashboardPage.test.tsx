import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../DashboardPage';

// Mock the useEggCollection hook
vi.mock('../../../hooks/useEggCollection', () => ({
  useEggCollection: vi.fn(),
}));

import { useEggCollection } from '../../../hooks/useEggCollection';

const mockUseEggCollection = useEggCollection as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockUseEggCollection.mockReturnValue({
    todayEntry: null,
    recentEntries: [],
    isLoading: false,
    saveEntry: vi.fn(),
    updateEntry: vi.fn(),
    deleteEntry: vi.fn(),
    getEntriesInRange: vi.fn(),
    todayDate: '2026-06-02',
  });
});

describe('DashboardPage', () => {
  it('renders the date heading', () => {
    render(<DashboardPage />);
    // Date format example: "Tuesday, June 2"
    expect(screen.getByText(/June 2/)).toBeInTheDocument();
  });

  it('shows 4 summary cards with default values', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Eggs Today')).toBeInTheDocument();
    expect(screen.getByText('Sales Today')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Profit')).toBeInTheDocument();
  });

  it('shows "--" when no egg entry exists for today', () => {
    render(<DashboardPage />);
    const dashboards = screen.getAllByText('--');
    expect(dashboards.length).toBeGreaterThanOrEqual(1);
  });

  it('displays egg count when todayEntry exists', () => {
    mockUseEggCollection.mockReturnValue({
      todayEntry: { id: '1', date: '2026-06-02', quantity: 127, notes: '', createdAt: '', updatedAt: '' },
      recentEntries: [],
      isLoading: false,
      saveEntry: vi.fn(),
      todayDate: '2026-06-02',
    });

    render(<DashboardPage />);
    expect(screen.getByText('127')).toBeInTheDocument();
  });

  it('renders 4 quick action buttons', () => {
    render(<DashboardPage />);
    expect(screen.getByLabelText('Record Eggs')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Sale')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Expense')).toBeInTheDocument();
    expect(screen.getByLabelText('Feed Stock')).toBeInTheDocument();
  });

  it('quick action buttons navigate via hash', () => {
    render(<DashboardPage />);
    const recordEggs = screen.getByLabelText('Record Eggs');
    fireEvent.click(recordEggs);
    expect(window.location.hash).toBe('#/production?tab=eggs');
  });
});
