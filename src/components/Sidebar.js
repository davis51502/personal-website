import React from 'react';

export default function Sidebar({ name, location, email, socials, photo }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <img className="avatar" src={photo} alt={`${name} avatar`} />
        <h3>{name}</h3>
        <p className="location">{location}</p>
        <p className="email"><a href={`mailto:${email}`}>{email}</a></p>
        <div className="sidebar-socials">
          {socials.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>
          ))}
        </div>
      </div>
    </aside>
  );
}
