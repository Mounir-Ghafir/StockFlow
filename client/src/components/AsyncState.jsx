export const Loading = ({ label = 'Loading data...' }) => (
  <div className="state state-loading">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-500)' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{label}</span>
  </div>
);

export const Empty = ({ message = 'Nothing here yet.' }) => (
  <div className="state state-empty">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-light)', marginBottom: '8px' }}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{message}</span>
  </div>
);

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="state state-error">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <span style={{ flex: 1, fontWeight: 500 }}>{message}</span>
    {onRetry && <button className="button button-ghost" type="button" onClick={onRetry}>Try again</button>}
  </div>
);
