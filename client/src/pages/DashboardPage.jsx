import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { dashboardApi, productsApi, salesApi } from '../api/resourcesApi';
import PageHeader from '../components/PageHeader';
import { Empty, ErrorState, Loading } from '../components/AsyncState';

const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'Admin';
  const [state, setState] = useState({ loading: true, error: '', summary: null, lowStock: [], sales: [] });
  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const [summaryResponse, productsResponse, salesResponse] = await Promise.all([
        user?.role === 'Admin' ? dashboardApi.summary() : Promise.resolve({ data: {} }),
        productsApi.list({ lowStock: user?.role === 'Admin', limit: 5 }), salesApi.list(),
      ]);
      setState({ loading: false, error: '', summary: summaryResponse.data, lowStock: productsResponse.data || [], sales: (salesResponse.data || []).slice(0, 5) });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.response?.data?.error?.message || 'Unable to load dashboard.' }));
    }
  }, [user?.role]);
  useEffect(() => { load(); }, [load]);

  if (state.loading) return <Loading label="Loading your overview..." />;
  if (state.error) return <ErrorState message={state.error} onRetry={load} />;
  return <>
    <PageHeader eyebrow={`${isAdmin ? 'Admin' : 'Employee'} overview`} title="Your inventory, at a glance" description="A quick read on inventory health and sales activity." />
    <section className="metric-grid"><div className="metric-card"><span>Stock value</span><strong>{money(state.summary?.stockValue)}</strong><small>Current inventory at retail price</small></div><div className="metric-card accent"><span>Low-stock items</span><strong>{state.summary?.lowStockCount || 0}</strong><small>Needs a replenishment decision</small></div><div className="metric-card"><span>Sales, last 30 days</span><strong>{money(state.summary?.recentSalesTotal)}</strong><small>{isAdmin ? 'Across all employees' : 'Your completed sales'}</small></div></section>
    <section className="content-grid"><div className="panel"><div className="panel-heading"><h2>Low-stock watchlist</h2><span className="muted">{state.lowStock.length} shown</span></div>{state.lowStock.length ? <div className="compact-list">{state.lowStock.map((product) => <div className="list-row" key={product._id}><div><strong>{product.name}</strong><small>{product.sku}</small></div><span className="status status-warning">{product.quantityInStock} left</span></div>)}</div> : <Empty message="Inventory levels look healthy." />}</div><div className="panel"><div className="panel-heading"><h2>Recent sales</h2><span className="muted">Latest activity</span></div>{state.sales.length ? <div className="compact-list">{state.sales.map((sale) => <div className="list-row" key={sale._id}><div><strong>{sale.employee?.name || 'Employee'}</strong><small>{new Date(sale.createdAt).toLocaleDateString()}</small></div><strong>{money(sale.totalAmount)}</strong></div>)}</div> : <Empty message="No sales recorded yet." />}</div></section>
  </>;
};

export default DashboardPage;
