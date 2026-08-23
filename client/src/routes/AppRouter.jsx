import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import AppLayout from '../components/AppLayout';
import { authApi } from '../api/authApi';
import { logout, setUser } from '../features/auth/authSlice';
import ProductListPage from '../pages/ProductListPage';
import ProductFormPage from '../pages/ProductFormPage';
import CatalogPage from '../pages/CatalogPage';
import NewSalePage from '../pages/NewSalePage';
import SalesHistoryPage from '../pages/SalesHistoryPage';
import PurchaseOrdersPage from '../pages/PurchaseOrdersPage';

const AppRouter = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) authApi.me(token).then((result) => dispatch(setUser(result.user))).catch(() => dispatch(logout()));
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/new" element={<ProtectedRoute adminOnly><ProductFormPage /></ProtectedRoute>} />
          <Route path="products/:id/edit" element={<ProtectedRoute adminOnly><ProductFormPage /></ProtectedRoute>} />
          <Route path="catalog" element={<ProtectedRoute adminOnly><CatalogPage /></ProtectedRoute>} />
          <Route path="sales/new" element={<NewSalePage />} />
          <Route path="sales" element={<SalesHistoryPage />} />
          <Route path="purchase-orders" element={<ProtectedRoute adminOnly><PurchaseOrdersPage /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to={token ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
