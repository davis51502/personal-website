import React from 'react';
import { Link } from 'react-router-dom';
import navItems from '../../data/nav';
import './Footer.css';

export default function Footer({ socials = [] }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <nav className="footer-nav" aria-label="Footer">
          {navItems.map((item) => (
            <Link key={item.id} to={item.path}>{item.label}</Link>
          ))}
        </nav>
        <div className="footer-meta">
          <span>© {new Date().getFullYear()} Davis Wollesen</span>
          {socials.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
