import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiZap, FiHome, FiBook, FiGrid, FiBarChart2 } from 'react-icons/fi';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',          label: 'Home',      icon: <FiHome /> },
  { to: '/study',     label: 'Study',     icon: <FiBook /> },
  { to: '/quiz',      label: 'Quiz',      icon: <FiZap /> },
  { to: '/subjects',  label: 'Subjects',  icon: <FiGrid /> },
  { to: '/dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`navbar${scrolled ? ' scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container">
          {/* Logo */}
          <Link
            to="/"
            className="nav-logo"
            aria-label="SnapStudy home"
            onClick={closeMenu}
          >
            <div className="nav-logo-mark" aria-hidden="true">S</div>
            <div className="nav-logo-text">
              <span className="nav-logo-name">SnapStudy</span>
              <span className="nav-logo-tagline">NST · Active Learning</span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="nav-right">
            <div className="nav-streak" aria-label="Current study streak">
              🔥 <span>0 day streak</span>
            </div>
            <Link
              to="/study"
              className="btn btn-primary"
              id="nav-cta-start-studying"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Start Studying
            </Link>

            {/* Hamburger */}
            <button
              className={`nav-hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer"
        className={`nav-mobile-drawer${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="nav-mobile-links" role="list">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-mobile-link${isActive ? ' active' : ''}`
                }
                onClick={closeMenu}
              >
                {icon} {label}
              </NavLink>
            </li>
          ))}
          <li style={{ marginTop: '8px' }}>
            <Link
              to="/study"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={closeMenu}
              id="nav-mobile-cta"
            >
              Start Studying
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
