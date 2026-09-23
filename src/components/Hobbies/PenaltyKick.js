import React, { useState } from 'react';

const ZONES = ['left', 'center', 'right'];
const SHOTS_PER_ROUND = 5;

/**
 * Decide where the keeper dives, given every zone the player has shot at so far
 * (oldest first, e.g. ['left', 'left', 'right']). Must return one of ZONES.
 */
function chooseKeeperDive(history) {
  // Random for now; history is available for a smarter keeper later.
  return ZONES[Math.floor(Math.random() * ZONES.length)];
}

export default function PenaltyKick() {
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState(0);
  const [shot, setShot] = useState(null); // { aim, dive, scored }
  const [best, setBest] = useState(0);

  const shotsTaken = history.length;
  const roundOver = shotsTaken >= SHOTS_PER_ROUND;

  const shoot = (aim) => {
    if (shot || roundOver) return;
    const dive = chooseKeeperDive(history);
    const scored = dive !== aim;
    const nextGoals = goals + (scored ? 1 : 0);

    setShot({ aim, dive, scored });
    window.setTimeout(() => {
      setHistory((h) => [...h, aim]);
      setGoals(nextGoals);
      setShot(null);
      if (shotsTaken + 1 >= SHOTS_PER_ROUND) setBest((b) => Math.max(b, nextGoals));
    }, 1100);
  };

  const reset = () => {
    setHistory([]);
    setGoals(0);
    setShot(null);
  };

  const status = shot
    ? (shot.scored ? 'GOAL!' : 'Saved!')
    : roundOver
      ? `Final: ${goals} / ${SHOTS_PER_ROUND}${goals === SHOTS_PER_ROUND ? ' (perfect round!)' : ''}`
      : 'Pick a corner to shoot';

  return (
    <div className="penalty">
      <div className="penalty-scoreboard" aria-live="polite">
        <span>Goals <strong>{goals}</strong></span>
        <span>Shot <strong>{Math.min(shotsTaken + (shot ? 1 : 0), SHOTS_PER_ROUND)}</strong> / {SHOTS_PER_ROUND}</span>
        <span>Best <strong>{best}</strong></span>
      </div>

      <div className="penalty-pitch">
        <div className="penalty-goal">
          {ZONES.map((zone) => (
            <button
              key={zone}
              type="button"
              className="penalty-zone"
              onClick={() => shoot(zone)}
              disabled={Boolean(shot) || roundOver}
              aria-label={`Shoot ${zone}`}
            />
          ))}
          <div className={`penalty-keeper dive-${shot ? shot.dive : 'none'}`} aria-hidden="true" />
        </div>
        <div className={`penalty-ball aim-${shot ? shot.aim : 'none'}`} aria-hidden="true" />
        <p className={`penalty-status${shot ? (shot.scored ? ' is-goal' : ' is-save') : ''}`}>{status}</p>
      </div>

      <div className="hobby-controls">
        <button type="button" className="hobby-button" onClick={reset} disabled={shotsTaken === 0 || Boolean(shot)}>
          {roundOver ? 'Play again' : 'Restart'}
        </button>
        <span className="hobby-hint">Five shots. Can you beat the keeper?</span>
      </div>
    </div>
  );
}
