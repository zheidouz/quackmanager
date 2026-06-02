import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EggCollectionForm from '../EggCollectionForm';

// Mock the useEggCollection hook
vi.mock('../../../hooks/useEggCollection', () => ({
  useEggCollection: vi.fn(),
}));

import { useEggCollection } from '../../../hooks/useEggCollection';

const mockUseEggCollection = useEggCollection as unknown as ReturnType<typeof vi.fn>;

const defaultMock = {
  todayEntry: null,
  recentEntries: [],
  isLoading: false,
  saveEntry: vi.fn().mockResolvedValue({ id: 'new-id', date: '2026-06-02', quantity: 127 }),
  updateEntry: vi.fn(),
  deleteEntry: vi.fn(),
  getEntriesInRange: vi.fn(),
  todayDate: '2026-06-02',
};

beforeEach(() => {
  mockUseEggCollection.mockReturnValue(defaultMock);
  // Reset window.location.hash
  window.location.hash = '';
});

function renderForm() {
  return render(
    <BrowserRouter>
      <EggCollectionForm />
    </BrowserRouter>
  );
}

describe('EggCollectionForm', () => {
  it('shows loading skeleton while loading', () => {
    mockUseEggCollection.mockReturnValue({ ...defaultMock, isLoading: true });
    const { container } = renderForm();
    // Should have animate-pulse elements
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders date picker with today date', () => {
    renderForm();
    const dateInput = screen.getByLabelText('Collection date') as HTMLInputElement;
    expect(dateInput).toBeInTheDocument();
    expect(dateInput.value).toBe('2026-06-02');
  });

  it('renders egg count stepper with default 0', () => {
    renderForm();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increases count when + button is clicked', () => {
    renderForm();
    const increaseBtn = screen.getByLabelText('Increase egg count');
    fireEvent.click(increaseBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('decreases count when - button is clicked', () => {
    renderForm();
    const increaseBtn = screen.getByLabelText('Increase egg count');
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    expect(screen.getByText('3')).toBeInTheDocument();

    const decreaseBtn = screen.getByLabelText('Decrease egg count');
    fireEvent.click(decreaseBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('disables decrease button when count is 0', () => {
    renderForm();
    const decreaseBtn = screen.getByLabelText('Decrease egg count');
    expect(decreaseBtn).toBeDisabled();
  });

  it('renders optional notes input', () => {
    renderForm();
    const notesInput = screen.getByLabelText('Optional notes about this collection');
    expect(notesInput).toBeInTheDocument();
    expect(notesInput).toHaveAttribute('placeholder', 'e.g., Few extra-small today');
  });

  it('renders save button', () => {
    renderForm();
    expect(screen.getByLabelText('Save egg collection')).toBeInTheDocument();
    expect(screen.getByText('Save Egg Collection')).toBeInTheDocument();
  });

  it('shows "Update" instead of "Save" when editing existing entry', () => {
    mockUseEggCollection.mockReturnValue({
      ...defaultMock,
      todayEntry: { id: '1', date: '2026-06-02', quantity: 100, notes: 'Good day', createdAt: '', updatedAt: '' },
    });
    renderForm();
    expect(screen.getByText('Update Egg Collection')).toBeInTheDocument();
  });

  it('pre-fills form when editing existing entry', () => {
    mockUseEggCollection.mockReturnValue({
      ...defaultMock,
      todayEntry: { id: '1', date: '2026-06-02', quantity: 100, notes: 'Good day', createdAt: '', updatedAt: '' },
    });
    renderForm();
    expect(screen.getByText('100')).toBeInTheDocument();
    const notesInput = screen.getByLabelText('Optional notes about this collection') as HTMLInputElement;
    expect(notesInput.value).toBe('Good day');
  });

  it('calls saveEntry on save button click', async () => {
    const saveEntry = vi.fn().mockResolvedValue({ id: 'new-id', date: '2026-06-02', quantity: 5 });
    mockUseEggCollection.mockReturnValue({ ...defaultMock, saveEntry });

    renderForm();

    // Increase count to 5
    const increaseBtn = screen.getByLabelText('Increase egg count');
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);

    // Click save
    const saveBtn = screen.getByLabelText('Save egg collection');
    fireEvent.click(saveBtn);

    expect(saveEntry).toHaveBeenCalledWith({
      date: '2026-06-02',
      quantity: 5,
      notes: undefined,
    });
  });

  it('shows saved confirmation screen after saving', async () => {
    const saveEntry = vi.fn().mockResolvedValue({ id: '1', date: '2026-06-02', quantity: 10 });
    mockUseEggCollection.mockReturnValue({ ...defaultMock, saveEntry });

    renderForm();

    // Increase to 10
    const increaseBtn = screen.getByLabelText('Increase egg count');
    for (let i = 0; i < 10; i++) {
      fireEvent.click(increaseBtn);
    }

    fireEvent.click(screen.getByLabelText('Save egg collection'));

    // Wait for async save
    await screen.findByText('Saved!');
    expect(screen.getByText('10 eggs recorded')).toBeInTheDocument();
    expect(screen.getByLabelText('Record another egg collection')).toBeInTheDocument();
    expect(screen.getByLabelText('Go back to dashboard')).toBeInTheDocument();
  });

  it('shows error when saving fails', async () => {
    const saveEntry = vi.fn().mockRejectedValue(new Error('Network error'));
    mockUseEggCollection.mockReturnValue({ ...defaultMock, saveEntry });

    renderForm();

    const increaseBtn = screen.getByLabelText('Increase egg count');
    fireEvent.click(increaseBtn);

    fireEvent.click(screen.getByLabelText('Save egg collection'));

    await screen.findByText('Failed to save. Please try again.');
  });

  it('does not render recent entries when list is empty', () => {
    renderForm();
    expect(screen.queryByText('Last 7 Days')).not.toBeInTheDocument();
  });

  it('renders recent entries when available', () => {
    mockUseEggCollection.mockReturnValue({
      ...defaultMock,
      recentEntries: [
        { id: '2', date: '2026-06-01', quantity: 132, notes: '', createdAt: '', updatedAt: '' },
        { id: '3', date: '2026-05-31', quantity: 118, notes: '', createdAt: '', updatedAt: '' },
      ],
    });
    renderForm();
    expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
    expect(screen.getByText('132 eggs')).toBeInTheDocument();
    expect(screen.getByText('118 eggs')).toBeInTheDocument();
  });
});
