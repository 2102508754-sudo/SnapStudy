import { Link } from 'react-router-dom';
import { FiBarChart2, FiArrowRight } from 'react-icons/fi';
import './Placeholder.css';

export default function DashboardPage() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon" aria-hidden="true"><FiBarChart2 /></div>
      <span className="badge badge-success">Dashboard</span>
      <h1>Your Progress Dashboard</h1>
      <p>
        Progress rings, streaks, accuracy charts, and weak-topic highlights
        will appear here once you start studying.
      </p>
      <Link to="/study" className="btn btn-primary" id="dashboard-start-studying">
        Start Studying <FiArrowRight />
      </Link>
    </div>
  );
}
