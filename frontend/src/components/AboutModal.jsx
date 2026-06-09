import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// "jiveWorld" rainbow wordmark used at the top of the about popup.
function Wordmark() {
  const letters = [
    ['j', '#3aa7d4'],
    ['i', '#3aa7d4'],
    ['v', '#49b6c0'],
    ['e', '#5cc26a'],
    ['W', '#5cc26a'],
    ['o', '#8cc63f'],
    ['r', '#c9d12f'],
    ['l', '#f2c849'],
    ['d', '#ec8b2f'],
  ];
  return (
    <div className="text-center">
      <div className="text-5xl font-extrabold leading-none">
        {letters.map(([ch, color], i) => (
          <span key={i} style={{ color }}>
            {ch}
          </span>
        ))}
      </div>
      <div className="mt-1 tracking-[0.3em] text-lg font-bold" style={{ color: '#f2c849' }}>
        ESPAÑOL
      </div>
    </div>
  );
}

// Centered modal describing Jiveworld Español. Closes on backdrop click or Escape.
export default function AboutModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="animate-backdrop-fade fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-modal-pop w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="About Jiveworld Español"
      >
        <Wordmark />

        <p className="mt-8 text-lg leading-relaxed text-jw-ink dark:text-gray-100">
          Fluency starts with listening — understanding the language as it's really spoken.
          Jiveworld Español brings you stories in real Spanish from all over Latin America by the
          award-winning Radio Ambulante podcast. We'll guide you through the idioms, the cultures
          and the vernacular. With a robust ear, you'll never have to ask a Spanish speaker to slow
          down, or say it again.
        </p>

        <p className="mt-6 text-lg text-jw-ink dark:text-gray-100">
          Learn more at{' '}
          <a
            href="https://jiveworld.com"
            target="_blank"
            rel="noreferrer"
            className="text-jw-blue hover:underline"
          >
            jiveworld.com
          </a>
        </p>

        <button
          type="button"
          className="mt-8 flex w-full items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="flex items-center gap-3 text-lg font-semibold text-jw-ink dark:text-gray-100">
            <span aria-hidden="true">🌐</span>
            Jiveworld Español (English)
          </span>
          <span className="text-2xl text-gray-400 dark:text-gray-400">›</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-4 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}
