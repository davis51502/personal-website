import React from 'react';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-copy">
        <h4>{project.title}</h4>
        {project.tags?.length > 0 && (
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <p className="project-desc">{project.description}</p>
      {project.details?.notes && <p className="project-note">{project.details.notes}</p>}
      <div className="project-links">
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            Live Demo
          </a>
        )}
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noopener noreferrer">
            View Code
          </a>
        )}
      </div>
    </article>
  );
}
