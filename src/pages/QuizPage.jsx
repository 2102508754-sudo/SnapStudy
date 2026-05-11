import { Link } from 'react-router-dom';
import { FiZap, FiArrowRight } from 'react-icons/fi';
import './Placeholder.css';

export default function QuizPage() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon" aria-hidden="true"><FiZap /></div>
      <span className="badge badge-accent">Quick Quiz</span>
      <h1>Quiz Mode — Coming Soon</h1>
      <p>
        Randomised questions across all subjects, with optional timers and
        live score tracking. Add your syllabus content to unlock this.
      </p>
      <Link to="/" className="btn btn-accent" id="quiz-back-home">
        Back to Home <FiArrowRight />
      </Link>
    </div>
  );
}
