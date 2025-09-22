import React from 'react';
import './Contact.css';

export default function Contact({ email }) {
  return (
    <section id="contact" className="contact container">
      <h2>Contact</h2>
      <p>If you'd like to get in touch, email me at <a href={`mailto:${email}`}>{email}</a>.</p>
    </section>
  );
}
