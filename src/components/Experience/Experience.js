import React from 'react';
import './Experience.css';

export default function Experience({ experience = [], education = [], certifications = [] }) {
  return (
    <div className="experience">
      <section className="timeline-section" aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="timeline-heading">Experience</h2>
        <ol className="timeline">
          {experience.map((job) => (
            <li key={`${job.org}-${job.role}`} className="timeline-item">
              <div className="timeline-top">
                <h3>
                  {job.role} <span className="timeline-org">· {job.org}</span>
                </h3>
                <p className="timeline-dates">{job.start} – {job.end}</p>
              </div>
              <p className="timeline-location">{job.location}</p>
              <ul className="timeline-highlights">
                {job.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="timeline-section" aria-labelledby="education-heading">
        <h2 id="education-heading" className="timeline-heading">Education</h2>
        <ol className="timeline">
          {education.map((ed) => (
            <li key={ed.school} className="timeline-item">
              <div className="timeline-top">
                <h3>
                  {ed.degree} <span className="timeline-org">· {ed.school}</span>
                </h3>
                <p className="timeline-dates">{ed.end}</p>
              </div>
              <p className="timeline-location">{ed.location}</p>
              <ul className="timeline-highlights">
                {ed.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </li>
          ))}
        </ol>

        {certifications.length > 0 && (
          <div className="certifications">
            <h3>Licensing &amp; certifications</h3>
            <ul>
              {certifications.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
