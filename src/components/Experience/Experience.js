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
              <div className="timeline-aside">
                <p className="timeline-dates">{job.start} – {job.end}</p>
                <p className="timeline-location">{job.location}</p>
              </div>
              <div className="timeline-body">
                <h3>{job.role}</h3>
                <p className="timeline-org">{job.org}</p>
                <ul className="timeline-highlights">
                  {job.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="timeline-section" aria-labelledby="education-heading">
        <h2 id="education-heading" className="timeline-heading">Education</h2>
        <ol className="timeline">
          {education.map((ed) => (
            <li key={ed.school} className="timeline-item">
              <div className="timeline-aside">
                <p className="timeline-dates">{ed.end}</p>
                <p className="timeline-location">{ed.location}</p>
              </div>
              <div className="timeline-body">
                <h3>{ed.degree}</h3>
                <p className="timeline-org">{ed.school}</p>
                <ul className="timeline-highlights">
                  {ed.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
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
