import React, { useEffect, useRef } from 'react';
import './ResumeDrawer.css';

export default function ResumeDrawer({ open, onClose, href }) {
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="resume-drawer-root">
      <button
        type="button"
        className="resume-backdrop"
        aria-label="Close resume"
        onClick={onClose}
      />
      <aside
        className="resume-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-drawer-title"
      >
        <div className="resume-panel-header">
          <h2 id="resume-drawer-title">Resume</h2>
          <div className="resume-panel-actions">
            <a href={href} target="_blank" rel="noopener noreferrer">
              Open in new tab
            </a>
            <button
              type="button"
              className="resume-close"
              ref={closeRef}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        <iframe
          className="resume-frame"
          title="Davis Wollesen resume"
          src={href}
        />
      </aside>
    </div>
  );
}
