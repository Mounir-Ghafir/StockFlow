export const Loading = ({ label = 'Loading data...' }) => <div className="state state-loading">{label}</div>;

export const Empty = ({ message = 'Nothing here yet.' }) => <div className="state state-empty">{message}</div>;

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="state state-error">
    <span>{message}</span>
    {onRetry && <button className="button button-ghost" type="button" onClick={onRetry}>Try again</button>}
  </div>
);
