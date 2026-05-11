import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

/**
 * Layout wraps every page with:
 * - Ambient animated background
 * - Sticky Navbar
 * - <main> content area (via <Outlet />)
 * - Footer
 */
export default function Layout() {
  return (
    <div className="layout">
      {/* Ambient gradient orbs */}
      <div className="ambient-bg" aria-hidden="true" />

      <Navbar />

      <main
        id="main-content"
        className="layout-main"
        role="main"
        aria-label="Main content"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
