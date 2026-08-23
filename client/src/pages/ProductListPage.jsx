import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi, suppliersApi } from '../api/resourcesApi';
import PageHeader from '../components/PageHeader';
import { Empty, ErrorState, Loading } from '../components/AsyncState';

const ProductListPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]); const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({ search: '', category: '', supplier: '', lowStock: false, page: 1 });
  const [options, setOptions] = useState({ categories: [], suppliers: [] }); const [status, setStatus] = useState({ loading: true, error: '' });
  const load = useCallback(async () => { try { const [result, categories, suppliers] = await Promise.all([productsApi.list({ ...filters, limit: 10 }), categoriesApi.list(), suppliersApi.list()]); setProducts(result.data || []); setPagination(result.pagination || { page: 1, pages: 1 }); setOptions({ categories: categories.data || [], suppliers: suppliers.data || [] }); setStatus({ loading: false, error: '' }); } catch (error) { setStatus({ loading: false, error: error.response?.data?.error?.message || 'Unable to load products.' }); } }, [filters]);
  useEffect(() => { load(); }, [load]);
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: key === 'page' ? value : 1 }));
  return <><PageHeader eyebrow="Inventory" title="Products" description="Search the catalog, spot risk, and keep stock moving." action={user?.role === 'Admin' && <Link className="button" to="/products/new">Add product</Link>} />
    <section className="toolbar"><input aria-label="Search products" placeholder="Search by name or SKU" value={filters.search} onChange={(event) => update('search', event.target.value)} /><select aria-label="Category" value={filters.category} onChange={(event) => update('category', event.target.value)}><option value="">All categories</option>{options.categories.map((item) => <option value={item._id} key={item._id}>{item.name}</option>)}</select><select aria-label="Supplier" value={filters.supplier} onChange={(event) => update('supplier', event.target.value)}><option value="">All suppliers</option>{options.suppliers.map((item) => <option value={item._id} key={item._id}>{item.name}</option>)}</select><label className="check"><input type="checkbox" checked={filters.lowStock} onChange={(event) => update('lowStock', event.target.checked)} /> Low stock only</label></section>
    {status.loading ? <Loading /> : status.error ? <ErrorState message={status.error} onRetry={load} /> : products.length === 0 ? <Empty message="No products match these filters." /> : <><div className="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Supplier</th><th>Price</th><th>In stock</th><th></th></tr></thead><tbody>{products.map((product) => <tr key={product._id}><td><strong>{product.name}</strong><small>{product.sku}</small></td><td>{product.category?.name || '—'}</td><td>{product.supplier?.name || '—'}</td><td>${Number(product.price).toFixed(2)}</td><td><span className={product.quantityInStock <= product.lowStockThreshold ? 'status status-warning' : 'status status-good'}>{product.quantityInStock}</span></td><td>{user?.role === 'Admin' && <Link className="text-link" to={`/products/${product._id}/edit`}>Edit</Link>}</td></tr>)}</tbody></table></div><div className="pagination"><span>Page {pagination.page} of {pagination.pages || 1}</span><button className="button button-ghost" disabled={pagination.page <= 1} onClick={() => update('page', pagination.page - 1)}>Previous</button><button className="button button-ghost" disabled={pagination.page >= pagination.pages} onClick={() => update('page', pagination.page + 1)}>Next</button></div></>}
  </>;
};
export default ProductListPage;
