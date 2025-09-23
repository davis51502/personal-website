import React from 'react';

export default function About({ bio, skills }) {
  return (
    <section id="about" className="about container">
      <h2>About</h2>
      <p>{bio}</p>
      <h3>Skills</h3>
      <ul className="skills">
        {skills.map(s => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </section>
  );
}
