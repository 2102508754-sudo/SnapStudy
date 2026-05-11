import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiGrid } from 'react-icons/fi';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import SEO from '../components/seo/SEO';
import './SubjectsPage.css';

// ── Database (Empty for now) ──────────────────────────────────────
const MOCK_SUBJECTS_DB = [];

// Simulated API Call
const fetchSubjectsPage = async (page, limit = 9) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      resolve({
        data: MOCK_SUBJECTS_DB.slice(start, end),
        hasMore: end < MOCK_SUBJECTS_DB.length
      });
    }, 100);
  });
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load next page function
  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    const response = await fetchSubjectsPage(page);
    setSubjects(prev => [...prev, ...response.data]);
    setHasMore(response.hasMore);
    setPage(p => p + 1);
  }, [page, hasMore]);

  // Hook up infinite scroll
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !isInitialLoad);

  // Initial load
  useEffect(() => {
    loadMore().finally(() => setIsInitialLoad(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="subjects-page container">
      <SEO 
        title="Browse Subjects" 
        description="Browse through the complete catalog of computer science and technology subjects available on SnapStudy." 
        path="/subjects" 
      />
      <header className="subjects-header">
        <span className="badge badge-primary">Course Catalog</span>
        <h1>All Subjects</h1>
        <p className="text-secondary">
          Browse through all available modules. Scroll down to load more subjects from the database.
        </p>
      </header>

      <div className="subjects-grid">
        {subjects.length === 0 && !isInitialLoad && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            No subjects added yet. Add your syllabus data to see them here!
          </div>
        )}
        {subjects.map((subj) => (
          <article key={subj.id} className="glass-card subject-card">
            <div className="subject-card-icon" aria-hidden="true">
              {subj.icon}
            </div>
            <h3>{subj.title}</h3>
            <div className="subject-card-meta">
              {subj.topicsCount} topics &nbsp;·&nbsp; {subj.difficulty}
            </div>
            <p className="subject-card-desc">{subj.description}</p>
            <Link to={`/study`} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
              View Course <FiArrowRight />
            </Link>
          </article>
        ))}
      </div>

      {/* Infinite Scroll Sentinel / Loading Indicator */}
      {hasMore ? (
        <div ref={sentinelRef} className="infinite-scroll-sentinel">
          <div className="loader-spinner" aria-label="Loading more subjects..." />
          <span>Loading more modules...</span>
        </div>
      ) : (
        <div className="end-of-list">
          You've reached the end of the catalog.
        </div>
      )}
    </div>
  );
}
