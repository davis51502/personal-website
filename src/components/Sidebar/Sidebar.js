import React from "react";
import "./Sidebar.css";

// The 'socials' prop now expects an 'icon' property
export default function Sidebar({ name, location, email, socials = [], photo }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        {photo && <img className="avatar" src={photo} alt={`${name} avatar`} />}
        {name && <h3>{name}</h3>}
        {location && <p className="location">{location}</p>}
        {email && (
          <p className="email">
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        )}

        <div className="sidebar-actions">
          <a
            className="resume-link"
            href="/(Resume Davis Wollesen).pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume
          </a>

        </div>

        {socials.length > 0 && (
          <div className="sidebar-socials">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name} // Good for accessibility
              >
                {s.icon} {/* Render the icon component here */}
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}