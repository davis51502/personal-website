import React, { useMemo, useState } from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import './Projects.css';

const ALL = 'All';

// Most-used tags first, so the strongest signal leads the filter row.
function collectTags(projects) {
  const counts = new Map();
  projects.forEach((p) => (p.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

export default function Projects({ projects }) {
  const [activeTag, setActiveTag] = useState(ALL);
  const tags = useMemo(() => [ALL, ...collectTags(projects)], [projects]);

  const visible = activeTag === ALL
    ? projects
    : projects.filter((p) => p.tags?.includes(activeTag));

  return (
    <section id="projects" className="projects container">
      <div className="section-heading">
        <h2>Projects</h2>
        <p className="section-lead">
          A mix of production sites, product experiments, and finance-focused tools I&apos;ve been building.
        </p>
      </div>

      <div className="project-filters" role="group" aria-label="Filter projects by technology">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`filter-chip${activeTag === tag ? ' active' : ''}`}
            aria-pressed={activeTag === tag}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <p className="filter-count" aria-live="polite">
        Showing {visible.length} of {projects.length} projects
      </p>

      <div className="projects-grid">
        {visible.map(p => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </section>
  );
}
