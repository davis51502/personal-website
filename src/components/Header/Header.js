import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ name, title, activeSection, onNavigate }) {
  const navLink = (id, label) => {
    const path = id === 'about' ? '/' : `/${id}`;
    return (
      <Link
        to={path}
        className={activeSection === id ? 'active' : ''}
        onClick={() => onNavigate(id)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <img src="/dw.jpeg" alt="" className="title-logo" />
          <div className="brand-text">
            <p className="name">{name}</p>
            <p className="title">{title}</p>
          </div>
        </div>
        <nav className="main-nav" aria-label="Primary">
          {navLink('about', 'About')}
          {navLink('projects', 'Projects')}
          {navLink('blog', 'Reviews')}
          {navLink('contact', 'Contact')}
        </nav>
      </div>
    </header>
  );
}
