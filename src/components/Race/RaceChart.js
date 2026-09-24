import React, { useEffect, useMemo, useRef, useState } from 'react';

const HEIGHT = 320;
const MARGIN = { top: 14, right: 16, bottom: 28, left: 48 };
const LABEL_GUTTER = 118;
const STEPS = [0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100];

export const formatPct = (v, digits = 1) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(digits)}%`;

const formatDate = (iso, withYear = false) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
  });

function niceTicks(min, max) {
  const step = STEPS.find((s) => (max - min) / s <= 6) || 100;
  const first = Math.floor(min / step) * step;
  const last = Math.ceil(max / step) * step;
  const ticks = [];
  for (let t = first; t <= last + 1e-9; t += step) ticks.push(Number(t.toFixed(4)));
  return ticks;
}

// Spread end-of-line labels apart so they never overlap, keeping them inside [top, bottom].
function spreadLabels(items, minGap, top, bottom) {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  sorted.forEach((s) => { s.y = Math.min(Math.max(s.y, top), bottom); });
  for (let i = 1; i < sorted.length; i++) {
    sorted[i].y = Math.max(sorted[i].y, sorted[i - 1].y + minGap);
  }
  if (sorted.length && sorted[sorted.length - 1].y > bottom) {
    sorted[sorted.length - 1].y = bottom;
    for (let i = sorted.length - 2; i >= 0; i--) {
      sorted[i].y = Math.min(sorted[i].y, sorted[i + 1].y - minGap);
    }
  }
  return sorted;
}

/**
 * Line chart of % return since the start. `series` items: { id, label, color, dashed, points: [[date, value]] }.
 * Hovering (or arrow keys when focused) moves a crosshair that reads out every series at that date.
 */
export default function RaceChart({ series, startingCash, directLabels = false, highlight, onHighlight, label }) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(720);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const narrow = width < 520;
  const showLabels = directLabels && !narrow;
  const right = showLabels ? LABEL_GUTTER : MARGIN.right;
  const innerW = width - MARGIN.left - right;
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

  const dates = useMemo(() => {
    const longest = series.reduce((a, s) => (s.points.length > a.length ? s.points : a), []);
    return longest.map(([d]) => d);
  }, [series]);

  const lines = useMemo(
    () => series.map((s) => ({ ...s, returns: s.points.map(([, v]) => (v / startingCash - 1) * 100) })),
    [series, startingCash],
  );

  const all = lines.flatMap((l) => l.returns);
  const lo = Math.min(0, ...all);
  const hi = Math.max(0, ...all);
  const pad = Math.max((hi - lo) * 0.08, 0.5);
  const ticks = niceTicks(lo - pad, hi + pad);
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];

  const x = (i) => MARGIN.left + (dates.length > 1 ? (i / (dates.length - 1)) * innerW : innerW / 2);
  const y = (v) => MARGIN.top + (1 - (v - yMin) / (yMax - yMin || 1)) * innerH;

  const xTickCount = Math.min(dates.length, narrow ? 3 : 6);
  const xTicks = xTickCount > 1
    ? Array.from({ length: xTickCount }, (_, k) => Math.round((k / (xTickCount - 1)) * (dates.length - 1)))
    : [0];

  const endLabels = showLabels
    ? spreadLabels(
        lines.map((l) => ({ id: l.id, label: l.label, color: l.color, dashed: l.dashed, value: l.returns[l.returns.length - 1], y: y(l.returns[l.returns.length - 1]) })),
        16, MARGIN.top + 6, MARGIN.top + innerH,
      )
    : [];

  const indexFromEvent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    const i = Math.round(((px - MARGIN.left) / innerW) * (dates.length - 1));
    return Math.max(0, Math.min(dates.length - 1, i));
  };

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const current = hoverIndex ?? dates.length - 1;
    setHoverIndex(Math.max(0, Math.min(dates.length - 1, current + (e.key === 'ArrowRight' ? 1 : -1))));
  };

  const readout = hoverIndex == null
    ? null
    : lines
        .map((l) => ({ id: l.id, label: l.label, color: l.color, dashed: l.dashed, value: l.returns[hoverIndex] }))
        .filter((r) => r.value != null)
        .sort((a, b) => b.value - a.value);
  const tipLeft = hoverIndex != null && x(hoverIndex) > width * 0.6;

  if (!dates.length) return null;

  return (
    <div className="race-chart" ref={wrapRef}>
      <svg
        width={width}
        height={HEIGHT}
        role="img"
        aria-label={label}
        tabIndex={0}
        onPointerMove={(e) => setHoverIndex(indexFromEvent(e))}
        onPointerLeave={() => setHoverIndex(null)}
        onFocus={() => setHoverIndex(dates.length - 1)}
        onBlur={() => setHoverIndex(null)}
        onKeyDown={onKeyDown}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={MARGIN.left} x2={MARGIN.left + innerW} y1={y(t)} y2={y(t)}
              className={t === 0 ? 'race-axis-zero' : 'race-grid'}
            />
            <text x={MARGIN.left - 8} y={y(t)} className="race-tick" textAnchor="end" dominantBaseline="middle">
              {t === 0 ? '0%' : formatPct(t, Number.isInteger(t) ? 0 : 1)}
            </text>
          </g>
        ))}
        {xTicks.map((i, k) => (
          <text
            key={i}
            x={x(i)}
            y={HEIGHT - 8}
            className="race-tick"
            textAnchor={k === 0 ? 'start' : k === xTicks.length - 1 ? 'end' : 'middle'}
          >
            {formatDate(dates[i])}
          </text>
        ))}

        {lines.map((l) => {
          const d = l.returns.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
          const dimmed = highlight && highlight !== l.id;
          return (
            <path
              key={l.id}
              d={d}
              fill="none"
              stroke={l.color}
              strokeWidth={highlight === l.id ? 3 : 2}
              strokeDasharray={l.dashed ? '5 4' : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={dimmed ? 0.18 : 1}
              style={{ transition: 'opacity 0.2s ease' }}
            />
          );
        })}

        {endLabels.map((e) => (
          <g
            key={e.id}
            className="race-end-label"
            opacity={highlight && highlight !== e.id ? 0.35 : 1}
            onPointerEnter={() => onHighlight?.(e.id)}
            onPointerLeave={() => onHighlight?.(null)}
          >
            <line
              x1={MARGIN.left + innerW + 8} x2={MARGIN.left + innerW + 20} y1={e.y} y2={e.y}
              stroke={e.color} strokeWidth="2" strokeDasharray={e.dashed ? '3 2' : undefined}
            />
            <text x={MARGIN.left + innerW + 25} y={e.y} dominantBaseline="middle">
              <tspan className="race-end-name">{e.label}</tspan>
              <tspan className="race-end-value" dx="5">{formatPct(e.value)}</tspan>
            </text>
          </g>
        ))}

        {hoverIndex != null && (
          <g pointerEvents="none">
            <line
              x1={x(hoverIndex)} x2={x(hoverIndex)} y1={MARGIN.top} y2={MARGIN.top + innerH}
              className="race-crosshair"
            />
            {readout.map((r) => (
              <circle key={r.id} cx={x(hoverIndex)} cy={y(r.value)} r="4" fill={r.color} stroke="#fff" strokeWidth="2" />
            ))}
          </g>
        )}
      </svg>

      {readout && (
        <div
          className="race-tooltip"
          style={tipLeft
            ? { right: width - x(hoverIndex) + 12 }
            : { left: x(hoverIndex) + 12 }}
          role="status"
        >
          <p className="race-tooltip-date">{formatDate(dates[hoverIndex], true)}</p>
          {readout.map((r) => (
            <p key={r.id} className="race-tooltip-row">
              <span className={`race-key${r.dashed ? ' dashed' : ''}`} style={{ '--key': r.color }} />
              <strong>{formatPct(r.value, 2)}</strong>
              <span>{r.label}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
