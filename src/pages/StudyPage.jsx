import { useState, useEffect, useRef } from 'react';
import { FiClock, FiCheckCircle, FiChevronRight, FiRotateCcw, FiZap, FiSearch } from 'react-icons/fi';
import { topics } from '../data/topics';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';
import './StudyPage.css';

/* ── Helpers ─────────────────────────────────── */

/** Very simple inline-markdown renderer for **bold** text */
function renderBody(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/** Detect markdown-style table and render it as <table> */
function renderNoteBody(body) {
  if (body.includes('|---|')) {
    const rows = body.trim().split('\n').filter(Boolean);
    const headers = rows[0].split('|').filter(Boolean).map(h => h.trim());
    const dataRows = rows.slice(2).map(r =>
      r.split('|').filter(Boolean).map(c => c.trim())
    );
    return (
      <div className="note-table-wrap">
        <table className="note-table">
          <thead>
            <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{renderBody(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <p className="note-body">{renderBody(body)}</p>;
}

/* ── Sub-components ──────────────────────────── */

function NoteCard({ note, onContinue, isLast }) {
  return (
    <article className="glass-card note-card">
      <h3>{note.heading}</h3>
      {renderNoteBody(note.body)}
      {note.highlight && (
        <div className="note-highlight">{note.highlight}</div>
      )}
      {note.code && (
        <div className="note-code">
          <pre>{note.code.trim()}</pre>
        </div>
      )}
      <div className="note-continue-btn">
        <button className="btn btn-primary" onClick={onContinue} id={`continue-${note.id}`}>
          {isLast ? 'Go to Practice Questions' : 'Next Section'} <FiChevronRight />
        </button>
      </div>
    </article>
  );
}

function QuizSection({ questions, onComplete }) {
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(null);
  const [answered, setAnswered]   = useState(false);
  const [score, setScore]         = useState(0);
  const [done, setDone]           = useState(false);

  const q = questions[current];
  const LETTERS = ['A', 'B', 'C', 'D'];

  function handleSelect(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctIndex) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
      onComplete(score + (selected === q.correctIndex ? 1 : 0));
    }
  }

  function handleRetry() {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setDone(false);
  }

  const finalScore = score + (done && selected === q?.correctIndex ? 0 : 0);
  const pct = Math.round((finalScore / questions.length) * 100);

  if (done) {
    const total = questions.length;
    const emoji = finalScore === total ? '🎉' : finalScore >= total / 2 ? '👍' : '📚';
    return (
      <div className="glass-card score-screen">
        <div className="score-ring-wrap" aria-label={`Score: ${finalScore} out of ${total}`}>
          <div>
            <div className="score-number">{finalScore}/{total}</div>
            <div className="score-label">correct</div>
          </div>
        </div>
        <h2>{emoji} {finalScore === total ? 'Perfect!' : finalScore >= total / 2 ? 'Good Job!' : 'Keep Practicing'}</h2>
        <p>
          You scored <strong style={{ color: 'var(--color-primary-light)' }}>
            {pct}%
          </strong> on this topic.
          {finalScore < total && ' Review the notes and try again!'}
        </p>
        <div className="score-actions">
          <button className="btn btn-ghost" onClick={handleRetry} id="quiz-retry-btn">
            <FiRotateCcw /> Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="quiz-section" aria-labelledby="quiz-heading">
      <div className="quiz-header">
        <FiZap color="var(--color-accent)" />
        <h3 id="quiz-heading">Practice Questions</h3>
        <span className="quiz-q-count">
          {current + 1} / {questions.length}
        </span>
      </div>

      <div className="glass-card quiz-card">
        <p className="quiz-question">{q.question}</p>
        <div className="quiz-options" role="group" aria-label="Answer options">
          {q.options.map((opt, idx) => {
            let cls = 'quiz-option';
            if (answered) {
              if (idx === q.correctIndex) cls += ' correct';
              else if (idx === selected)  cls += ' wrong';
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                id={`quiz-opt-${current}-${idx}`}
                aria-pressed={selected === idx}
              >
                <span className="quiz-option-letter">{LETTERS[idx]}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div className="quiz-explanation">
              <strong>Explanation:</strong> {q.explanation}
            </div>
            <div style={{ marginTop: '16px' }}>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                id={`quiz-next-${current}`}
              >
                {current + 1 < questions.length ? 'Next Question' : 'See Results'}{' '}
                <FiChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ── Main StudyPage ──────────────────────────── */
export default function StudyPage() {
  const [activeTopic, setActiveTopic] = useState(topics.length > 0 ? topics[0] : null);
  const [noteIndex, setNoteIndex]     = useState(0);
  const [showQuiz, setShowQuiz]       = useState(false);
  const [completed, setCompleted]     = useState({}); // topicId → score

  // ── Debounced search ──────────────────────────
  // `searchRaw` updates on every keystroke (controls the input).
  // `searchQuery` only updates 350 ms after the user stops typing.
  // The topic filter runs against `searchQuery` — not every raw keystroke.
  const [searchRaw,   setSearchRaw]   = useState('');
  const searchQuery = useDebounce(searchRaw, 350);

  // ── Throttled Scroll Progress ───────────────────
  // We track how far down the user has scrolled to show a reading progress bar.
  // We don't want to re-render the React component on EVERY pixel scrolled (60+ times/sec),
  // so we throttle the update to at most once every 100ms.
  const [scrollRaw, setScrollRaw] = useState(0);
  const scrollThrottled = useThrottle(scrollRaw, 100);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollRaw(percentage);
    };

    const el = contentRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => { if (el) el.removeEventListener('scroll', handleScroll); };
  }, [activeTopic]);

  const filteredTopics = topics.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!activeTopic) {
    return (
      <div className="study-layout">
        <aside className="study-sidebar" aria-label="Topic list">
          <div className="sidebar-topics-header">
            <h2>Topics</h2>
          </div>
          <p className="sidebar-no-results">No topics added yet.</p>
        </aside>
        <div className="study-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '12px' }}>Ready for Content</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Add your syllabus content to <code>src/data/topics.js</code> to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const notes     = activeTopic.notes;
  const questions = activeTopic.questions;
  const totalSteps = notes.length + 1; // +1 for quiz phase
  const currentStep = showQuiz ? totalSteps : noteIndex + 1;
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  function selectTopic(topic) {
    setActiveTopic(topic);
    setNoteIndex(0);
    setShowQuiz(false);
  }

  function handleContinueNote() {
    if (noteIndex + 1 < notes.length) {
      setNoteIndex(n => n + 1);
    } else {
      setShowQuiz(true);
    }
  }

  function handleQuizComplete(score) {
    setCompleted(prev => ({
      ...prev,
      [activeTopic.id]: score,
    }));
  }

  return (
    <div className="study-layout">
      {/* ── Sidebar ── */}
      <aside className="study-sidebar" aria-label="Topic list">
        {/* Debounced search input */}
        <div className="sidebar-search-wrap">
          <FiSearch className="sidebar-search-icon" aria-hidden="true" />
          <input
            id="topic-search-input"
            className="sidebar-search-input"
            type="search"
            placeholder="Search topics…"
            value={searchRaw}
            onChange={e => setSearchRaw(e.target.value)}
            aria-label="Search topics"
            autoComplete="off"
          />
          {/* Typing indicator — shows while debounce is pending */}
          {searchRaw !== searchQuery && (
            <span className="sidebar-search-typing" aria-hidden="true" title="Filtering…">⏳</span>
          )}
        </div>

        <div className="sidebar-topics-header">
          <h2>Topics</h2>
          {searchQuery && (
            <span className="sidebar-result-count" aria-live="polite">
              {filteredTopics.length} result{filteredTopics.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {filteredTopics.length === 0 ? (
          <p className="sidebar-no-results">No topics match &ldquo;{searchQuery}&rdquo;</p>
        ) : (
          <ul className="topic-list" role="list">
            {filteredTopics.map(topic => (
              <li key={topic.id}>
                <button
                  className={`topic-btn${activeTopic.id === topic.id ? ' active' : ''}`}
                  onClick={() => selectTopic(topic)}
                  id={`topic-btn-${topic.id}`}
                  aria-current={activeTopic.id === topic.id ? 'true' : undefined}
                >
                  <span className="topic-btn-icon">{topic.icon}</span>
                  <span>{topic.title}</span>
                  <span className="topic-btn-meta">
                    {completed[topic.id] !== undefined && (
                      <FiCheckCircle className="topic-check" aria-label="Completed" />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* ── Content ── */}
      <div className="study-content" ref={contentRef} style={{ overflowY: 'auto', height: 'calc(100vh - var(--nav-height))' }}>
        {/* Throttled Reading Progress Bar */}
        <div 
          style={{
            position: 'sticky', top: 0, left: 0, right: 0, height: '3px', 
            background: 'var(--bg-surface)', zIndex: 10, marginBottom: '20px'
          }}
        >
          <div 
            style={{ 
              height: '100%', width: `${scrollThrottled}%`, 
              background: 'var(--color-primary-light)', transition: 'width 0.1s linear' 
            }} 
          />
        </div>

        {/* Topic header */}
        <header className="study-topic-header">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-primary">{activeTopic.subject}</span>
            <span className="badge" style={{
              background: 'rgba(245,158,11,0.12)',
              color: '#FCD34D',
              border: '1px solid rgba(245,158,11,0.3)',
            }}>
              {activeTopic.difficulty}
            </span>
          </div>
          <h1 id="study-topic-heading">
            {activeTopic.icon} {activeTopic.title}
          </h1>
          <div className="study-meta">
            <FiClock size={13} />
            <span>~{activeTopic.estimatedMins} min read + quiz</span>
            <span>·</span>
            <span>{questions.length} questions</span>
          </div>
        </header>

        {/* Progress bar */}
        <div className="study-progress-wrap" aria-label="Study progress">
          <div className="study-progress-label">
            <span>{showQuiz ? 'Practice Questions' : `Section ${noteIndex + 1} of ${notes.length}`}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="study-progress-track">
            <div
              className="study-progress-fill"
              style={{ width: `${progressPct}%` }}
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Notes OR Quiz */}
        {!showQuiz ? (
          <NoteCard
            key={`${activeTopic.id}-${noteIndex}`}
            note={notes[noteIndex]}
            onContinue={handleContinueNote}
            isLast={noteIndex === notes.length - 1}
          />
        ) : (
          <QuizSection
            key={activeTopic.id}
            questions={questions}
            onComplete={handleQuizComplete}
          />
        )}
      </div>
    </div>
  );
}
