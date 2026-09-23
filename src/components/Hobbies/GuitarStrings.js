import React, { useRef, useState } from 'react';

// Standard tuning, low E to high E (Hz).
const STRINGS = [
  { note: 'E', freq: 82.41 },
  { note: 'A', freq: 110.0 },
  { note: 'D', freq: 146.83 },
  { note: 'G', freq: 196.0 },
  { note: 'B', freq: 246.94 },
  { note: 'e', freq: 329.63 },
];

// Karplus-Strong: a burst of noise fed through a decaying averaging loop sounds like a plucked string.
function pluckBuffer(ctx, freq) {
  const length = Math.floor(ctx.sampleRate * 1.6);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  const period = Math.round(ctx.sampleRate / freq);
  for (let i = 0; i < period; i += 1) data[i] = Math.random() * 2 - 1;
  for (let i = period; i < length; i += 1) {
    data[i] = 0.996 * 0.5 * (data[i - period] + data[i - period + 1]);
  }
  return buffer;
}

export default function GuitarStrings() {
  const ctxRef = useRef(null);
  const [ringing, setRinging] = useState({});

  const play = (index, delay = 0) => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    source.buffer = pluckBuffer(ctx, STRINGS[index].freq);
    source.connect(gain).connect(ctx.destination);
    source.start(ctx.currentTime + delay);

    window.setTimeout(() => {
      setRinging((r) => ({ ...r, [index]: Date.now() }));
      window.setTimeout(() => setRinging((r) => ({ ...r, [index]: undefined })), 600);
    }, delay * 1000);
  };

  const strum = () => STRINGS.forEach((_, i) => play(i, i * 0.035));

  return (
    <div className="guitar">
      <div className="guitar-neck" role="group" aria-label="Guitar strings">
        {STRINGS.map((s, i) => (
          <button
            key={s.note + i}
            type="button"
            className={`guitar-string${ringing[i] ? ' ringing' : ''}`}
            style={{ '--thickness': `${3.2 - i * 0.45}px` }}
            onMouseEnter={(e) => e.buttons === 0 && play(i)}
            onClick={() => play(i)}
            aria-label={`Pluck ${s.note} string`}
          >
            <span className="string-note">{s.note}</span>
            <span className="string-line" />
          </button>
        ))}
      </div>
      <div className="hobby-controls">
        <button type="button" className="hobby-button" onClick={strum}>Strum</button>
        <span className="hobby-hint">Hover or tap a string to pluck it. Turn your sound on.</span>
      </div>
    </div>
  );
}
