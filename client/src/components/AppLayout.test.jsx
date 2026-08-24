import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../features/auth/authSlice';
import AppLayout from './AppLayout';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, Outlet: () => <div data-testid="outlet" /> };
});

const renderLayout = (role) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { token: 'test-token', user: { name: 'Test User', role }, isLoading: false, error: null },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    </Provider>
  );
};

afterEach(cleanup);

describe('AppLayout role-based navigation', () => {
  const adminOnlyLinks = ['Add product', 'Catalog setup', 'Purchase orders'];
  const sharedLinks = ['Overview', 'Products', 'New sale', 'Sales history'];

  it('hides every admin-only nav link from employees', () => {
    renderLayout('Employee');

    sharedLinks.forEach((label) => expect(screen.getByRole('link', { name: label })).toBeInTheDocument());
    adminOnlyLinks.forEach((label) => expect(screen.queryByRole('link', { name: label })).not.toBeInTheDocument());
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('shows the admin section for admins', () => {
    renderLayout('Admin');

    [...sharedLinks, ...adminOnlyLinks].forEach((label) => (
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    ));
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
  });
});
