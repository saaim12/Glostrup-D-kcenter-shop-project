// src/Components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  // Persist theme
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(d => !d);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Left: brand */}
        <div className="navbar-logo">
          <Link to="/">Glostrup Dækcenter</Link>
        </div>

        {/* Center: links */}
        <ul className="navbar-links" role="menubar" aria-label="Primary">
          <li className={location.pathname === '/' ? 'active' : ''} role="none">
            <Link to="/" role="menuitem">Home</Link>
          </li>
          <li className={location.pathname === '/about' ? 'active' : ''} role="none">
            <Link to="/about" role="menuitem">About</Link>
          </li>
        </ul>

        {/* Right: theme toggle */}
        <div className="nav-actions">
          <button
            className="dark-toggle-btn"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to light' : 'Switch to dark'}
          >
            {isDark ? '🌞' : '🌓'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
