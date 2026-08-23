import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const AppLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  const signOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">S</span> StockFlow</div>
        <nav className="nav-list" aria-label="Primary navigation">
          <NavLink to="/" end>Overview</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/sales/new">New sale</NavLink>
          <NavLink to="/sales">Sales history</NavLink>
          {isAdmin && <>
            <span className="nav-label">Admin</span>
            <NavLink to="/products/new">Add product</NavLink>
            <NavLink to="/catalog">Catalog setup</NavLink>
            <NavLink to="/purchase-orders">Purchase orders</NavLink>
          </>}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip"><strong>{user?.name || 'User'}</strong><span>{user?.role || 'Employee'}</span></div>
          <button className="button button-ghost full-width" type="button" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="main-content"><Outlet /></main>
    </div>
  );
};

export default AppLayout;
