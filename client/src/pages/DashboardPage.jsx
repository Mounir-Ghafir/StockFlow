import { useSelector } from 'react-redux';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <main style={{ padding: '32px' }}>
      <h1>StockFlow Dashboard</h1>
      <p>Welcome, {user?.name || 'User'}.</p>
      <p>Role: {user?.role || 'Employee'}</p>
    </main>
  );
};

export default DashboardPage;
