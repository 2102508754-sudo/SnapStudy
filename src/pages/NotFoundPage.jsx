import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';
import './Placeholder.css';

export default function NotFoundPage() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon" style={{ color: 'var(--color-danger)' }} aria-hidden="true">
        <FiAlertTriangle />
      </div>
      <span className="badge" style={{
        background: 'rgba(244,63,94,0.15)',
        color: '#FDA4AF',
        border: '1px solid rgba(244,63,94,0.3)',
      }}>
        404
      </span>
      <h1>Page Not Found</h1>
      <p>
        Looks like this page doesn't exist — or hasn't been built yet.
        Head back home and keep studying!
      </p>
      <Link to="/" className="btn btn-primary" id="not-found-back-home">
        <FiHome /> Go Home
      </Link>
    </div>
  );
}
