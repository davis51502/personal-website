import React from 'react';
import './Contact.css';

export default function Contact({ email }) {
  return (
    <section id="contact" className="contact container">
      <div className="section-heading">
        <p className="section-eyebrow">Contact</p>
        <h2>Let&apos;s Connect</h2>
        <p className="section-lead">
          I&apos;m always open to talking through software ideas, investing, or interesting projects in progress.
        </p>
      </div>
      <div className="contact-panel">
        <p>If you&apos;d like to get in touch, email me at <a href={`mailto:${email}`}>{email}</a>.</p>
      </div>
    </section>
  );
}
