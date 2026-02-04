import React from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import './LiveProjects.css';

export default function LiveProjects({ projects = [] }) {
  return (
    <section id="liveprojects" className="liveprojects container">
      <h2>Live Projects</h2>
      <p className="live-intro">Interactive demos and integrations I'm actively building and polishing.</p>

      <div className="live-grid">
        {projects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </section>
  );
}
