import React, { useState } from 'react';
import './Contact.css';

export default function Contact({ email, socials = [] }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section id="contact" className="contact container">
      <div className="section-heading">
        <h2>Let&apos;s Connect</h2>
        <p className="section-lead">
          I&apos;m open to software engineering and finance roles, and always happy to talk through
          software ideas, investing, or interesting projects in progress.
        </p>
      </div>

      <div className="contact-email">
        <a className="contact-primary" href={`mailto:${email}`}>{email}</a>
        <button type="button" className="contact-copy" onClick={copyEmail}>
          {copied ? 'Copied!' : 'Copy email'}
        </button>
        <span className="visually-hidden" aria-live="polite">{copied ? 'Email copied to clipboard' : ''}</span>
      </div>

      {socials.length > 0 && (
        <ul className="contact-links">
          {socials.map((s) => (
            <li key={s.name}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
