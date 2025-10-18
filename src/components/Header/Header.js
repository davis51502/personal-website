import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ name, title, socials, activeSection, onNavigate }) {
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
          <img src="/dw.jpeg" alt="Davis Wollesen Software Engineer/Investment Analyst" className="title-logo" />
          <div className="brand-text">
            <h1 className="name">{name}</h1>
            <p className="title">{title}</p>
          </div>
        </div>
        <nav className="main-nav">
          {navLink('about', 'About')}
          {navLink('projects', 'Projects')}
          {navLink('blog', 'Reviews')}
          {navLink('contact', 'Contact')}
        </nav>
        <nav className="socials">
          {socials.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}