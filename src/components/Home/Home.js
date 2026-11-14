import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ResumeDrawer from '../ResumeDrawer/ResumeDrawer';
import Experience from '../Experience/Experience';
import ProjectCard from '../ProjectCard/ProjectCard';
import { RACE_DATA_URL, MODEL_COLORS, BENCHMARK_COLOR } from '../../data/race';
import './Home.css';

const RESUME_HREF = encodeURI('/(Resume Davis Wollesen).pdf');

const formatPct = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(2)}%`;

// Live standings from the AI Portfolio Race. Renders nothing if the data can't be loaded.
function RaceTicker() {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof fetch !== 'function') return undefined;
    let cancelled = false;
    fetch(RACE_DATA_URL, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => !cancelled && setData(json))
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!data?.models?.length) return null;

  const rows = [
    ...[...data.models]
      .sort((a, b) => b.return_pct - a.return_pct)
      .map((m) => ({ id: m.id, label: m.label, value: m.return_pct, color: MODEL_COLORS[m.id] })),
    ...(data.benchmark
      ? [{ id: 'benchmark', label: data.benchmark.label, value: data.benchmark.return_pct, color: BENCHMARK_COLOR }]
      : []),
  ];

  return (
    <Link to="/race" className="ticker" aria-label="AI Portfolio Race standings. Open the race page.">
      <span className="ticker-title"><span className="ticker-dot" aria-hidden="true" />AI race · live</span>
      <span className="ticker-rows">
        {rows.map((r) => (
          <span key={r.id} className="ticker-row">
            <span className="ticker-key" style={{ '--key': r.color }} aria-hidden="true" />
            <span className="ticker-name">{r.label}</span>
            <span className={`ticker-value ${r.value >= 0 ? 'up' : 'down'}`}>
              {r.value >= 0 ? '▲' : '▼'} {formatPct(r.value)}
            </span>
          </span>
        ))}
      </span>
      <span className="ticker-more" aria-hidden="true">open →</span>
    </Link>
  );
}

export default function Home({
  name,
  tagline,
  location,
  email,
  socials = [],
  photo,
  introLines = [],
  stats = [],
  featured = [],
  skillGroups = [],
  experience = [],
  education = [],
  certifications = [],
}) {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <section id="about" className="home">
      <div className="hero">
        <div className="term">
          <div className="term-bar" aria-hidden="true">
            <span className="term-dots"><i /><i /><i /></span>
            <span className="term-path">davis@nyc: ~</span>
          </div>
          <div className="term-body">
            <p className="term-cmd" aria-hidden="true">whoami</p>
            {name && <h1 className="hero-name">{name}</h1>}
            {tagline && <p className="hero-tagline">{tagline}</p>}

            <p className="term-cmd" aria-hidden="true">cat about.txt</p>
            <div className="hero-intro">
              {introLines.map((line) => <p key={line}>{line}</p>)}
            </div>

            <p className="term-cmd" aria-hidden="true">ls links/</p>
            <div className="hero-actions">
              <button type="button" className="resume-trigger" onClick={() => setResumeOpen(true)}>
                View resume
              </button>
              <a className="resume-download" href={RESUME_HREF} download="Davis Wollesen Resume.pdf">
                Download PDF
              </a>
              {socials.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>
              ))}
            </div>
          </div>
        </div>

        <aside className="hero-side">
          {photo && <img className="portrait" src={photo} alt={`Portrait of ${name}`} />}
          <dl className="hero-facts">
            <div><dt>loc</dt><dd>{location}</dd></div>
            <div><dt>mail</dt><dd><a href={`mailto:${email}`}>{email}</a></dd></div>
            <div><dt>now</dt><dd>{experience[0] ? `${experience[0].role}, ${experience[0].org}` : ''}</dd></div>
          </dl>
        </aside>
      </div>

      <RaceTicker />

      {stats.length > 0 && (
        <dl className="stats">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      )}

      {featured.length > 0 && (
        <section className="home-block" aria-labelledby="featured-heading">
          <div className="home-block-head">
            <h2 id="featured-heading" className="timeline-heading">Featured work</h2>
            <Link to="/work" className="home-more">All work →</Link>
          </div>
          <div className="featured-grid">
            {featured.map((p) => <ProjectCard key={p.title} project={p} />)}
          </div>
        </section>
      )}

      <Experience experience={experience} education={education} certifications={certifications} />

      {skillGroups.length > 0 && (
        <section className="home-block" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="timeline-heading">Skills</h2>
          <div className="skill-groups">
            {skillGroups.map((group) => (
              <div key={group.label} className="skill-group">
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <ResumeDrawer open={resumeOpen} onClose={() => setResumeOpen(false)} href={RESUME_HREF} />
    </section>
  );
}
