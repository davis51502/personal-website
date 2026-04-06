import React from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import './Projects.css';

export default function Projects({ projects }) {
  return (
    <section id="projects" className="projects container">
      <div className="section-heading">
        <p className="section-eyebrow">Selected Work</p>
        <h2>Projects</h2>
        <p className="section-lead">
          A mix of production sites, product experiments, and finance-focused tools I&apos;ve been building.
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
