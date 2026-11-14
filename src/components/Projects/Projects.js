import React from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import './Projects.css';

export default function Projects({ projects }) {
  return (
    <section id="projects" className="projects container">
      <div className="section-heading">
        <h2>Work</h2>
        <p className="section-lead">
          Finance tools, client work and experiments I&apos;ve built, followed by how I use AI in practice.
        </p>
      </div>
      <div className="projects-grid">
        {projects.map(p => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </section>
  );
}
