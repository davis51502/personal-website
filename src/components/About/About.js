import React from 'react';
import './About.css';

export default function About({ bio, skills = [] }) {
  return (
    <section id="about" className="about">
      <h2 className="section-title">About</h2>
      <p className="bio">{bio}</p>

      <div className="skills">
        {skills.map((s, i) => (
          <span key={i} className="skill">{s}</span>
        ))}
      </div>
    </section>
  );
}