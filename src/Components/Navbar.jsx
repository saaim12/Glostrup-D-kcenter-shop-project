// src/Components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Glostrup Dækcenter</Link>
      </div>

      <ul className="navbar-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/about' ? 'active' : ''}>
          <Link to="/about">About</Link>
        </li>
      </ul>

      <button className="dark-toggle-btn" onClick={toggleDarkMode}>
        🌓
      </button>
    </nav>
  );
};

export default Navbar;
