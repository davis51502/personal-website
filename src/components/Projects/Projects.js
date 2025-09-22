import React from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import './Projects.css';

export default function Projects({ projects }) {
  return (
    <section id="projects" className="projects container">
      <h2>Projects</h2>
      <div className="projects-grid">
        {projects.map(p => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </section>
  );
}
