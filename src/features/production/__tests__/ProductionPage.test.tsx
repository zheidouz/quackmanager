import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductionPage from '../ProductionPage';

// Mock child components
vi.mock('../EggCollectionForm', () => ({
  default: () => <div data-testid="egg-collection-form">Egg Collection Form</div>,
}));

vi.mock('../IncubationTab', () => ({
  default: () => <div data-testid="incubation-tab">Incubation Tab</div>,
}));

vi.mock('../DucklingTab', () => ({
  default: () => <div data-testid="duckling-tab">Duckling Tab</div>,
}));

function renderWithRoute(initialRoute = '/production') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/production" element={<ProductionPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProductionPage', () => {
  it('renders the page title', () => {
    renderWithRoute();
    expect(screen.getByText('Production')).toBeInTheDocument();
  });

  it('shows 3 tab buttons', () => {
    renderWithRoute();
    expect(screen.getByLabelText('Egg Collection')).toBeInTheDocument();
    expect(screen.getByLabelText('Incubation')).toBeInTheDocument();
    expect(screen.getByLabelText('Ducklings')).toBeInTheDocument();
  });

  it('defaults to egg collection tab', () => {
    renderWithRoute();
    expect(screen.getByTestId('egg-collection-form')).toBeInTheDocument();
  });

  it('switches to incubation tab when clicked', () => {
    renderWithRoute();
    const incubationTab = screen.getByLabelText('Incubation');
    fireEvent.click(incubationTab);

    expect(screen.getByTestId('incubation-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('egg-collection-form')).not.toBeInTheDocument();
  });

  it('switches to ducklings tab when clicked', () => {
    renderWithRoute();
    const ducklingsTab = screen.getByLabelText('Ducklings');
    fireEvent.click(ducklingsTab);

    expect(screen.getByTestId('duckling-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('egg-collection-form')).not.toBeInTheDocument();
  });

  it('reads initial tab from search params', () => {
    renderWithRoute('/production?tab=incubation');
    expect(screen.getByTestId('incubation-tab')).toBeInTheDocument();
  });
});
