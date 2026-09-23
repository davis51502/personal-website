import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navItems from '../../data/nav';
import './Header.css';

export default function Header({ name, title, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the phone menu whenever the page changes or Escape is pressed.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const links = navItems.map((item) => (
    <Link
      key={item.id}
      to={item.path}
      className={activeSection === item.id ? 'active' : ''}
      aria-current={activeSection === item.id ? 'page' : undefined}
    >
      {item.label}
    </Link>
  ));

  return (
    <header className={`header${menuOpen ? ' menu-open' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${name}, home`}>
          <img src="/dw.jpeg" alt="" className="title-logo" />
          <span className="brand-text">
            <span className="name">{name}</span>
            <span className="title">{title}</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Primary">
          {links}
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-icon" aria-hidden="true" />
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile" hidden={!menuOpen}>
        {links}
      </nav>
    </header>
  );
}
