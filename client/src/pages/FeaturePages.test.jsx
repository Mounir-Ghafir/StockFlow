import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../features/auth/authSlice';
import ProductListPage from './ProductListPage';
import NewSalePage from './NewSalePage';
import { categoriesApi, productsApi, salesApi, suppliersApi } from '../api/resourcesApi';

vi.mock('../api/resourcesApi', () => ({
  categoriesApi: { list: vi.fn() },
  productsApi: { list: vi.fn(), get: vi.fn(), create: vi.fn(), update: vi.fn() },
  salesApi: { list: vi.fn(), create: vi.fn() },
  suppliersApi: { list: vi.fn() },
}));

const renderWithState = (page, role = 'Employee') => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { token: 'test-token', user: { name: 'Test User', role }, isLoading: false, error: null } },
  });

  return render(<Provider store={store}><MemoryRouter>{page}</MemoryRouter></Provider>);
};

afterEach(() => cleanup());

describe('ProductListPage', () => {
  beforeEach(() => {
    productsApi.list.mockReset();
    categoriesApi.list.mockReset();
    suppliersApi.list.mockReset();
    categoriesApi.list.mockResolvedValue({ data: [] });
    suppliersApi.list.mockResolvedValue({ data: [] });
  });

  it('shows loading then an empty state', async () => {
    productsApi.list.mockResolvedValue({ data: [], pagination: { page: 1, pages: 1 } });
    renderWithState(<ProductListPage />);

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    expect(await screen.findByText('No products match these filters.')).toBeInTheDocument();
  });

  it('shows the API error and supports retry', async () => {
    productsApi.list.mockRejectedValueOnce({ response: { data: { error: { message: 'Catalog offline' } } } })
      .mockResolvedValueOnce({ data: [], pagination: { page: 1, pages: 1 } });
    renderWithState(<ProductListPage />);

    expect(await screen.findByText('Catalog offline')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('No products match these filters.')).toBeInTheDocument();
  });
});

describe('NewSalePage', () => {
  beforeEach(() => {
    productsApi.list.mockResolvedValue({ data: [{ _id: 'p1', name: 'Keyboard', price: 25, quantityInStock: 4 }], pagination: {} });
    salesApi.create.mockResolvedValue({ data: { _id: 'sale-1' } });
  });

  it('calculates a running total and submits the selected item', async () => {
    renderWithState(<NewSalePage />);

    await waitFor(() => expect(screen.getByRole('option', { name: /Keyboard/ })).toBeInTheDocument());
    fireEvent.change(screen.getByDisplayValue('Choose a product'), { target: { value: 'p1' } });
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getAllByText('$50.00')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Submit sale' }));
    await waitFor(() => expect(salesApi.create).toHaveBeenCalledWith({ items: [{ product: 'p1', quantity: 2 }] }));
  });
});