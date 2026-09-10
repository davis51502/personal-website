import React, { useState } from 'react';
import ResumeDrawer from '../ResumeDrawer/ResumeDrawer';
import './About.css';

const RESUME_HREF = encodeURI('/(Resume Davis Wollesen).pdf');

export default function About({
  name,
  location,
  email,
  socials = [],
  photo,
  bio,
  skillGroups = [],
}) {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <section id="about" className="about">
      <div className="about-hero">
        {photo && (
          <img className="portrait" src={photo} alt={`${name}`} />
        )}

        <div className="about-identity">
          {name && <h1 className="about-name">{name}</h1>}
          <p className="about-meta">
            {location}
            {location && email && <span aria-hidden="true"> · </span>}
            {email && <a href={`mailto:${email}`}>{email}</a>}
          </p>
          <div className="about-actions">
            <button
              type="button"
              className="resume-trigger"
              onClick={() => setResumeOpen(true)}
            >
              View resume
            </button>
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <p className="bio">{bio}</p>

      {skillGroups.length > 0 && (
        <div className="skill-groups">
          {skillGroups.map((group) => (
            <div key={group.label} className="skill-group">
              <h2>{group.label}</h2>
              <p>{group.items.join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      <ResumeDrawer
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        href={RESUME_HREF}
      />
    </section>
  );
}
