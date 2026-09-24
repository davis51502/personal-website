import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RaceChart, { formatPct } from './RaceChart';
import { RACE_DATA_URL, MODEL_COLORS, PERSONA_COLORS, BENCHMARK_COLOR, raceRules } from '../../data/race';
import './Race.css';

const FEED_PAGE = 12;

const money = (v) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const longDate = (iso) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';

function Delta({ value, suffix = '%', digits = 1 }) {
  const dir = value > 0.0005 ? 'up' : value < -0.0005 ? 'down' : 'flat';
  const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '';
  const text = suffix === '%' ? formatPct(value, digits) : `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(digits)}${suffix}`;
  return (
    <span className={`race-delta ${dir}`}>
      {arrow && <span aria-hidden="true">{arrow} </span>}
      {text}
    </span>
  );
}

function Key({ color, dashed }) {
  return <span className={`race-key${dashed ? ' dashed' : ''}`} style={{ '--key': color }} aria-hidden="true" />;
}

function Legend({ series, setHighlight }) {
  return (
    <ul className="race-legend" aria-label="Legend">
      {series.map((s) => (
        <li key={s.id} onPointerEnter={() => setHighlight(s.id)} onPointerLeave={() => setHighlight(null)}>
          <Key color={s.color} dashed={s.dashed} />{s.label}
        </li>
      ))}
    </ul>
  );
}

function benchmarkSeries(data) {
  return {
    id: 'benchmark',
    label: 'S&P 500',
    color: BENCHMARK_COLOR,
    dashed: true,
    points: data.benchmark.history,
  };
}

function CompareView({ data, personas, highlight, setHighlight }) {
  const bench = data.benchmark.return_pct;
  const models = [...data.models].sort((a, b) => b.return_pct - a.return_pct);
  const series = [
    ...data.models.map((m) => ({ id: m.id, label: m.label, color: MODEL_COLORS[m.id], points: m.history })),
    benchmarkSeries(data),
  ];

  return (
    <>
      <div className="race-scoreboard">
        {models.map((m, i) => {
          const team = data.traders.filter((t) => t.model === m.id).sort((a, b) => b.return_pct - a.return_pct);
          const best = personas[team[0]?.persona];
          return (
            <article
              key={m.id}
              className="race-score"
              onPointerEnter={() => setHighlight(m.id)}
              onPointerLeave={() => setHighlight(null)}
            >
              <p className="race-score-rank">{i === 0 ? '🏆 Leading' : `#${i + 1}`}</p>
              <h3><Key color={MODEL_COLORS[m.id]} />{m.label}</h3>
              <p className="race-score-model">{m.name}</p>
              <p className="race-score-value"><Delta value={m.return_pct} digits={2} /></p>
              <p className="race-score-meta">
                <Delta value={m.return_pct - bench} suffix=" pts" /> vs S&amp;P 500
              </p>
              {best && <p className="race-score-meta">Best trader: {best.emoji} {best.label}</p>}
            </article>
          );
        })}
      </div>

      <div className="race-panel">
        <div className="race-panel-head">
          <h3>Average return of each model’s five traders</h3>
          <p>S&amp;P 500 <Delta value={bench} digits={2} /></p>
        </div>
        <Legend series={series} setHighlight={setHighlight} />
        <RaceChart
          series={series}
          startingCash={data.starting_cash}
          directLabels
          highlight={highlight}
          onHighlight={setHighlight}
          label="Line chart of each AI model's average return compared with the S&P 500"
        />
      </div>

      <div className="race-panel">
        <div className="race-panel-head">
          <h3>Head to head</h3>
          <p>Same personality, same data, different AI. Best in each row marked 🏆.</p>
        </div>
        <div className="race-table-wrap">
          <table className="race-table race-h2h">
            <thead>
              <tr>
                <th scope="col">Trader</th>
                {data.models.map((m) => (
                  <th key={m.id} scope="col"><Key color={MODEL_COLORS[m.id]} />{m.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.personas.map((p) => {
                const row = data.models.map((m) => data.traders.find((t) => t.model === m.id && t.persona === p.id));
                const top = Math.max(...row.map((t) => t?.return_pct ?? -Infinity));
                return (
                  <tr key={p.id}>
                    <th scope="row"><span aria-hidden="true">{p.emoji}</span> {p.label}</th>
                    {row.map((t, i) => (
                      <td key={data.models[i].id} className={t && t.return_pct === top ? 'winner' : ''}>
                        {t ? <><Delta value={t.return_pct} digits={2} />{t.return_pct === top && <span className="race-trophy" aria-label="best in row"> 🏆</span>}</> : '—'}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr className="race-h2h-total">
                <th scope="row">Team average</th>
                {data.models.map((m) => <td key={m.id}><Delta value={m.return_pct} digits={2} /></td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ModelView({ data, model, personas, highlight, setHighlight }) {
  const bench = data.benchmark.return_pct;
  const traders = data.traders.filter((t) => t.model === model.id).sort((a, b) => b.return_pct - a.return_pct);
  const series = [
    ...data.personas.map((p) => {
      const t = data.traders.find((tr) => tr.model === model.id && tr.persona === p.id);
      return { id: p.id, label: `${p.emoji} ${p.label}`, color: PERSONA_COLORS[p.id], points: t.history };
    }),
    benchmarkSeries(data),
  ];

  return (
    <>
      <div className="race-panel">
        <div className="race-panel-head">
          <h3>{model.name}’s five traders</h3>
          <p>Team average <Delta value={model.return_pct} digits={2} /> · S&amp;P 500 <Delta value={bench} digits={2} /></p>
        </div>
        <Legend series={series} setHighlight={setHighlight} />
        <RaceChart
          series={series}
          startingCash={data.starting_cash}
          highlight={highlight}
          onHighlight={setHighlight}
          label={`Line chart of ${model.name}'s five traders' returns compared with the S&P 500`}
        />

        <div className="race-table-wrap">
          <table className="race-table race-leaderboard">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Trader</th>
                <th scope="col">Value</th>
                <th scope="col">Return</th>
                <th scope="col" className="race-hide-sm">vs S&amp;P</th>
                <th scope="col" className="race-hide-sm">Today</th>
                <th scope="col" className="race-hide-sm">Worst drop</th>
                <th scope="col" className="race-hide-sm">Trades</th>
              </tr>
            </thead>
            <tbody>
              {traders.map((t, i) => {
                const p = personas[t.persona];
                return (
                  <tr
                    key={t.id}
                    className={highlight === t.persona ? 'active' : ''}
                    onPointerEnter={() => setHighlight(t.persona)}
                    onPointerLeave={() => setHighlight(null)}
                  >
                    <td>{i + 1}</td>
                    <th scope="row"><Key color={PERSONA_COLORS[t.persona]} /><span aria-hidden="true">{p.emoji}</span> {p.label}</th>
                    <td>{money(t.value)}</td>
                    <td><Delta value={t.return_pct} digits={2} /></td>
                    <td className="race-hide-sm"><Delta value={t.return_pct - bench} suffix=" pts" /></td>
                    <td className="race-hide-sm"><Delta value={t.day_change_pct} digits={2} /></td>
                    <td className="race-hide-sm">{formatPct(t.max_drawdown_pct)}</td>
                    <td className="race-hide-sm">{t.trades}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="race-traders">
        {traders.map((t) => {
          const p = personas[t.persona];
          const latest = data.feed.find((f) => f.trader === t.id && f.status === 'executed');
          const rows = [
            ...t.holdings.slice(0, 6).map((h) => ({ label: h.ticker, title: h.name, weight: h.weight, gain: h.gain_pct })),
            ...(t.holdings.length > 6
              ? [{ label: `${t.holdings.length - 6} more`, weight: t.holdings.slice(6).reduce((s, h) => s + h.weight, 0) }]
              : []),
            { label: 'Cash', weight: t.cash_weight, cash: true },
          ];
          return (
            <article key={t.id} className="race-trader">
              <header>
                <h4><span aria-hidden="true">{p.emoji}</span> {p.label}</h4>
                <Delta value={t.return_pct} digits={2} />
              </header>
              <p className="race-trader-blurb">{p.blurb}</p>
              <ul className="race-holdings" aria-label={`${p.label} holdings`}>
                {rows.map((r) => (
                  <li key={r.label} title={r.title || undefined}>
                    <span className="race-holding-label">{r.label}</span>
                    <span className="race-bar">
                      <span
                        className={`race-bar-fill${r.cash ? ' cash' : ''}`}
                        style={{ width: `${Math.max(r.weight * 100, 0.5)}%`, '--key': PERSONA_COLORS[t.persona] }}
                      />
                    </span>
                    <span className="race-holding-weight">{(r.weight * 100).toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
              {latest && <blockquote className="race-trader-quote">“{latest.summary}”</blockquote>}
            </article>
          );
        })}
      </div>
    </>
  );
}

function Feed({ data, view, personas, modelsById }) {
  const [shown, setShown] = useState(FEED_PAGE);
  const items = data.feed.filter((f) => view === 'compare' || f.model === view);
  useEffect(() => setShown(FEED_PAGE), [view]);

  if (!items.length) return null;
  return (
    <div className="race-block">
      <h3 className="race-subheading">Trade feed</h3>
      <p className="race-block-lead">Every decision, in the traders’ own words. Open one to read the full reasoning.</p>
      <ol className="race-feed">
        {items.slice(0, shown).map((f) => {
          const p = personas[f.persona];
          const m = modelsById[f.model];
          return (
            <li key={f.id} className={`race-feed-item${f.status === 'failed' ? ' failed' : ''}`}>
              <p className="race-feed-meta">
                <span className="race-feed-who"><span aria-hidden="true">{p.emoji}</span> {p.label}</span>
                <span className="race-feed-model"><Key color={MODEL_COLORS[f.model]} />{m?.label}</span>
                <span className="race-feed-date">
                  {f.status === 'failed' ? `Decided ${longDate(f.decided)}` : `Traded ${longDate(f.executed)}`}
                </span>
              </p>
              {f.status === 'failed' ? (
                <p className="race-feed-summary">⚠ Returned an invalid answer twice and sat out the week.</p>
              ) : (
                <>
                  <p className="race-feed-summary">“{f.summary}”</p>
                  {f.changes.length > 0 && (
                    <ul className="race-changes" aria-label="Position changes">
                      {f.changes.slice(0, 8).map((c) => (
                        <li key={c.ticker} className={c.to > c.from ? 'up' : 'down'}>
                          <span aria-hidden="true">{c.to > c.from ? '▲' : '▼'}</span> {c.ticker}{' '}
                          {(c.from * 100).toFixed(0)}→{(c.to * 100).toFixed(0)}%
                        </li>
                      ))}
                      {f.changes.length > 8 && <li className="more">+{f.changes.length - 8} more</li>}
                    </ul>
                  )}
                  <details className="race-reasoning">
                    <summary>Read the reasoning</summary>
                    {f.reasoning.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
                  </details>
                </>
              )}
            </li>
          );
        })}
      </ol>
      {shown < items.length && (
        <button type="button" className="race-more" onClick={() => setShown((n) => n + FEED_PAGE)}>
          Show more trades
        </button>
      )}
    </div>
  );
}

function Rules() {
  return (
    <div className="race-block race-rules">
      <h3 className="race-subheading">How the race works</h3>
      <ul>
        {raceRules.map((r) => <li key={r}>{r}</li>)}
      </ul>
      <p className="race-disclaimer">
        Simulated money only. Nothing here is investment advice. Prices come from Yahoo Finance
        and headlines from NewsAPI.
      </p>
    </div>
  );
}

export default function Race() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    fetch(RACE_DATA_URL, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => !cancelled && setData(json))
      .catch((e) => !cancelled && setError(e.message));
    return () => { cancelled = true; };
  }, []);

  const personas = useMemo(() => Object.fromEntries((data?.personas || []).map((p) => [p.id, p])), [data]);
  const modelsById = useMemo(() => Object.fromEntries((data?.models || []).map((m) => [m.id, m])), [data]);
  const requested = params.get('view');
  const view = requested && modelsById[requested] ? requested : 'compare';
  const setView = (v) => {
    setHighlight(null);
    setParams(v === 'compare' ? {} : { view: v }, { replace: true });
  };

  const live = data?.status === 'live';

  return (
    <section id="race" className="race container">
      <div className="section-heading">
        <p className="section-eyebrow">Live experiment</p>
        <h2>The AI Portfolio Race</h2>
        <p className="section-lead">
          Claude, ChatGPT, and Gemini each run the same five investing personalities with $100,000 of
          simulated money. Same prompts, same market data, same headlines. Which AI invests best, and
          can any of them beat the S&amp;P 500?
        </p>
      </div>

      {error && <p className="race-message">The race data couldn’t be loaded right now ({error}). Try again in a few minutes.</p>}
      {!data && !error && <p className="race-message">Loading the race…</p>}

      {data && (
        <>
          <p className="race-status">
            <span className={`race-pill ${live ? 'live' : ''}`}>{live ? 'Live' : 'Starting soon'}</span>
            {live && <span>Day {data.benchmark.history.length}</span>}
            {live && <span>Started {longDate(data.start_date)}</span>}
            {data.as_of && <span>Prices as of {longDate(data.as_of)} close</span>}
            {data.next_decision && <span>{live ? 'Next' : 'First'} trades picked {longDate(data.next_decision)}</span>}
          </p>

          {live ? (
            <>
              <div className="race-tabs" role="tablist" aria-label="Choose a view">
                {[{ id: 'compare', label: 'Compare models' }, ...data.models].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    aria-selected={view === m.id}
                    className={view === m.id ? 'active' : ''}
                    onClick={() => setView(m.id)}
                  >
                    {m.id !== 'compare' && <Key color={MODEL_COLORS[m.id]} />}
                    {m.label}
                  </button>
                ))}
              </div>

              {view === 'compare' ? (
                <CompareView data={data} personas={personas} highlight={highlight} setHighlight={setHighlight} />
              ) : (
                <ModelView data={data} model={modelsById[view]} personas={personas} highlight={highlight} setHighlight={setHighlight} />
              )}

              <Feed data={data} view={view} personas={personas} modelsById={modelsById} />
            </>
          ) : (
            <div className="race-lineup">
              <div className="race-panel">
                <div className="race-panel-head"><h3>The lineup</h3></div>
                <div className="race-lineup-grid">
                  {data.personas.map((p) => (
                    <div key={p.id} className="race-lineup-persona">
                      <p className="race-lineup-emoji" aria-hidden="true">{p.emoji}</p>
                      <h4>{p.label}</h4>
                      <p>{p.blurb}</p>
                    </div>
                  ))}
                </div>
                <p className="race-lineup-models">
                  Each personality is played three times, by{' '}
                  {data.models.map((m, i) => (
                    <React.Fragment key={m.id}>
                      {i > 0 && (i === data.models.length - 1 ? ', and ' : ', ')}
                      <strong>{m.name}</strong>
                    </React.Fragment>
                  ))}
                  .
                </p>
              </div>
            </div>
          )}

          <Rules />
        </>
      )}
    </section>
  );
}
