import React, { useEffect, useState } from 'react';
import './AI.css';

const TYPE_MS = 12;

function SqlDemo({ examples }) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const example = examples[index];
  const done = typed >= example.sql.length;

  // Stream the recorded model output in, the way a live LLM response arrives.
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setTyped(example.sql.length);
      return undefined;
    }
    setTyped(0);
    // Derive progress from elapsed time so throttled background tabs still finish on schedule.
    const start = Date.now();
    const timer = window.setInterval(() => {
      const chars = Math.min(example.sql.length, Math.floor(((Date.now() - start) / TYPE_MS) * 2));
      setTyped(chars);
      if (chars >= example.sql.length) window.clearInterval(timer);
    }, TYPE_MS);
    return () => window.clearInterval(timer);
  }, [example]);

  return (
    <div className="sql-demo">
      <div className="sql-questions" role="group" aria-label="Example questions">
        {examples.map((ex, i) => (
          <button
            key={ex.question}
            type="button"
            className={`sql-question${i === index ? ' active' : ''}`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          >
            <span className="sql-skill">{ex.skill}</span>
            {ex.question}
          </button>
        ))}
      </div>

      <div className="sql-terminal" aria-live="polite">
        <p className="term-line"><span className="term-label">Question</span>{example.question}</p>
        <p className="term-line">
          <span className="term-label">Model output</span>
          <code className={example.blocked ? 'term-prose' : ''}>
            {example.sql.slice(0, typed)}
            {!done && <span className="term-cursor" aria-hidden="true">▌</span>}
          </code>
        </p>

        {done && (
          <div className="term-result">
            <p className={`term-guard ${example.blocked ? 'blocked' : 'passed'}`}>
              <span className="term-label">Guardrail</span>
              {example.blocked ? `✕ Blocked: ${example.blocked}` : '✓ Read-only SELECT, safe to run'}
            </p>
            {!example.blocked && (
              <table className="term-table">
                <thead>
                  <tr>{example.columns.map((c) => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {example.rows.map((row) => (
                    <tr key={row.join('|')}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      <p className="sql-footnote">
        Recorded runs from my GPT-4o text-to-SQL terminal against its sample financial database.
      </p>
    </div>
  );
}

export default function AI({ approach = [], caseStudies = [], sqlDemo = [], article }) {
  return (
    <section id="ai" className="ai container">
      <div className="section-heading">
        <h2>AI in Practice</h2>
        <p className="section-lead">
          I treat AI as an engineering tool, not a buzzword. The goal is to find where it creates real
          business value, ground it in real data, put guardrails around it, and measure whether it
          actually helps.
        </p>
      </div>

      <ol className="ai-approach">
        {approach.map((step, i) => (
          <li key={step.title}>
            <span className="ai-step">{String(i + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="ai-block">
        <h3 className="ai-subheading">Try it: ask a financial database a question</h3>
        <p className="ai-block-lead">
          Pick a question to see the SQL the model wrote, whether my guardrail let it through, and the
          result.
        </p>
        <SqlDemo examples={sqlDemo} />
      </div>

      <div className="ai-block">
        <h3 className="ai-subheading">Case studies</h3>
        <div className="ai-cases">
          {caseStudies.map((cs) => (
            <article key={cs.title} className="ai-case">
              <p className="ai-case-kind">{cs.kind}</p>
              <h4>{cs.title}</h4>
              <dl>
                <dt>Problem</dt>
                <dd>{cs.problem}</dd>
                <dt>AI approach</dt>
                <dd>{cs.approach}</dd>
                <dt>Why it matters</dt>
                <dd>{cs.value}</dd>
              </dl>
              <p className="ai-case-stack">{cs.stack.join(' · ')}</p>
              {(cs.url || cs.repo) && (
                <div className="ai-case-links">
                  {cs.url && <a href={cs.url} target="_blank" rel="noopener noreferrer">Live Demo</a>}
                  {cs.repo && <a href={cs.repo} target="_blank" rel="noopener noreferrer">View Code</a>}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      {article && (
        <p className="ai-article">
          More on how I think about AI adoption:{' '}
          <a href={article.url} target="_blank" rel="noopener noreferrer">&ldquo;{article.title}&rdquo; →</a>
        </p>
      )}
    </section>
  );
}
