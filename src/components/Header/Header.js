import React from 'react';
import './Header.css';

export default function Header({ name, title, socials, activeSection, onNavigate }) {
  const link = (id, label) => (
    <a
      href={`#${id}`}
      className={activeSection === id ? 'active' : ''}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(id);
      }}
    >
      {label}
    </a>
  );

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
          {link('about', 'About')}
          {link('projects', 'Projects')}
          {link('blog', 'Blog')}
          {link('contact', 'Contact')}
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