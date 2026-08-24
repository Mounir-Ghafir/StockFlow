import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { loginSuccess, setError } from '../features/auth/authSlice';

const emptyForm = {
  name: '',
  email: '',
  password: '',
};

const AuthPage = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, error } = useSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    dispatch(setError(null));

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? form
        : {
            email: form.email,
            password: form.password,
          };

      const response = await api.post(endpoint, payload);
      const { token: accessToken, user } = response.data;

      dispatch(loginSuccess({ token: accessToken, user }));
      navigate('/');
    } catch (requestError) {
      const message = requestError.response?.data?.error?.message || 'Authentication failed.';
      dispatch(setError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '420px', margin: '80px auto', padding: '24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
      <h2 style={{ marginBottom: '16px' }}>{isRegister ? 'Create account' : 'Sign in'}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
        {isRegister && (
          <label>
            <div style={{ marginBottom: '6px' }}>Name</div>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </label>
        )}

        <label>
          <div style={{ marginBottom: '6px' }}>Email</div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
          />
        </label>

        <label>
          <div style={{ marginBottom: '6px' }}>Password</div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
          />
        </label>

        {error && (
          <div style={{ color: '#b91c1c', background: '#fee2e2', padding: '10px 12px', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#111827', color: '#fff', cursor: 'pointer' }}>
          {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '18px', textAlign: 'center' }}>
        {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
        <button
          type="button"
          onClick={() => navigate(isRegister ? '/login' : '/register')}
          style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer', padding: 0 }}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </main>
  );
};

export default AuthPage;
