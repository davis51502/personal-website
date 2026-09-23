import React, { useState } from 'react';
import { FaGuitar, FaFutbol, FaSkiing, FaHiking } from 'react-icons/fa';
import GuitarStrings from './GuitarStrings';
import PenaltyKick from './PenaltyKick';
import './Hobbies.css';

const ICONS = { guitar: FaGuitar, soccer: FaFutbol, skiing: FaSkiing, hiking: FaHiking };
const PLAYGROUNDS = { guitar: GuitarStrings, soccer: PenaltyKick };

export default function Hobbies({ hobbies }) {
  const [activeId, setActiveId] = useState(hobbies[0]?.id);
  const active = hobbies.find((h) => h.id === activeId);
  const Playground = PLAYGROUNDS[activeId];

  return (
    <section id="hobbies" className="hobbies container">
      <div className="section-heading">
        <h2>Hobbies</h2>
        <p className="section-lead">
          What I&apos;m up to away from the keyboard. Pick one; a couple of them are playable.
        </p>
      </div>

      <div className="hobby-tiles" role="tablist" aria-label="Hobbies">
        {hobbies.map((h) => {
          const Icon = ICONS[h.id];
          const selected = h.id === activeId;
          return (
            <button
              key={h.id}
              type="button"
              role="tab"
              id={`hobby-tab-${h.id}`}
              aria-selected={selected}
              aria-controls="hobby-panel"
              className={`hobby-tile${selected ? ' active' : ''}`}
              onClick={() => setActiveId(h.id)}
            >
              {Icon && <Icon className="hobby-icon" aria-hidden="true" />}
              <span className="hobby-name">{h.name}</span>
              <span className="hobby-tagline">{h.tagline}</span>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          id="hobby-panel"
          className="hobby-panel"
          role="tabpanel"
          aria-labelledby={`hobby-tab-${active.id}`}
        >
          <p className="hobby-blurb">{active.blurb}</p>
          {Playground && <Playground key={active.id} />}
        </div>
      )}
    </section>
  );
}
