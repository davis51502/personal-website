import React from 'react';

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <h4>{project.title}</h4>
      <p className="project-desc">{project.description}</p>
      <div className="project-links">
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer">Live</a>
        )}
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noopener noreferrer">Code</a>
        )}
      </div>
    </article>
  );
}
