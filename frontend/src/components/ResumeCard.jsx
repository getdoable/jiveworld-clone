import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import StoryThumb from './StoryThumb.jsx';
import { SOUNDBITES } from '../data/stories.js';

const BASE = '/es-en/app/learn';

// The three things a "Reset story…" can clear, in display order.
const RESET_ITEMS = [
  {
    key: 'chapters',
    label: 'Chapter listening progress',
    hint: 'Marks every chapter as unplayed',
  },
  { key: 'vocab', label: 'Saved vocab', hint: 'Removes the words you bookmarked' },
  {
    key: 'soundbites',
    label: 'Completed Soundbites',
    hint: 'Resets your finished Soundbites',
  },
];

// Reset modal: a checklist of what to clear, confirmed or cancelled.
// Closes on backdrop click or Escape; mirrors AboutModal's overlay styling.
function ResetModal({ open, title, onCancel, onConfirm }) {
  const [picked, setPicked] = useState({
    chapters: true,
    vocab: true,
    soundbites: true,
  });

  // Re-check everything each time the modal is opened.
  useEffect(() => {
    if (open) setPicked({ chapters: true, vocab: true, soundbites: true });
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const anyPicked = RESET_ITEMS.some((it) => picked[it.key]);

  function toggle(key) {
    setPicked((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div
      className="animate-backdrop-fade fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="animate-modal-pop w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Reset ${title}`}
      >
        <h2 className="text-2xl font-bold text-jw-ink">Reset “{title}”</h2>
        <p className="mt-2 text-gray-500">Choose what you’d like to reset.</p>

        <div className="mt-6 flex flex-col gap-2">
          {RESET_ITEMS.map((it) => (
            <label
              key={it.key}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={picked[it.key]}
                onChange={() => toggle(it.key)}
                className="mt-1 h-5 w-5 accent-jw-blue"
              />
              <span>
                <span className="block text-lg font-semibold text-jw-ink">{it.label}</span>
                <span className="block text-sm text-gray-500">{it.hint}</span>
              </span>
            </label>
          ))}
        </div>

        <button
          type="button"
          disabled={!anyPicked}
          onClick={() => onConfirm(picked)}
          className="mt-6 w-full rounded-xl bg-jw-blue px-4 py-4 text-lg font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset selected
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 w-full rounded-xl bg-gray-100 px-4 py-4 text-lg font-semibold text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ResumeCard({ resume }) {
  const totalChapters = resume.chapters.length;
  const totalSoundbites = SOUNDBITES.length;

  // Local, interactive progress for this card. Seeded deterministically from the
  // story so the crawler sees identical content on first load, then mutated by
  // the "Reset story…" checklist.
  const [progress, setProgress] = useState({
    chaptersListened: resume.chapters.filter((c) => c.status === 'Done').length,
    savedVocab: 12,
    soundbitesDone: resume.soundbitesDone,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [exited, setExited] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  function handleReset(picked) {
    setProgress((p) => ({
      chaptersListened: picked.chapters ? 0 : p.chaptersListened,
      savedVocab: picked.vocab ? 0 : p.savedVocab,
      soundbitesDone: picked.soundbites ? 0 : p.soundbitesDone,
    }));
    setResetOpen(false);
  }

  if (exited) {
    return (
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-6">
        <span className="text-lg text-gray-500">You’ve exited review for now.</span>
        <button
          type="button"
          onClick={() => setExited(false)}
          className="font-semibold text-jw-blue hover:underline"
        >
          Resume review
        </button>
      </div>
    );
  }

  const allChaptersListened = progress.chaptersListened >= totalChapters;

  return (
    <div className="mt-5 flex items-start gap-5">
      <Link to={`${BASE}/stories/${resume.slug}`} className="shrink-0">
        <StoryThumb story={resume} size="lg" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <Link
              to={`${BASE}/stories/${resume.slug}`}
              className="flex items-center gap-2 text-xl font-bold text-jw-ink hover:underline"
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-sm text-white ${
                  allChaptersListened ? 'bg-jw-blue' : 'bg-gray-300'
                }`}
              >
                ✓
              </span>
              {resume.title}
            </Link>
            <div className="mt-1 flex items-center gap-4 text-sm font-semibold text-gray-500">
              <span>{resume.duration}</span>
              <span className="flex items-center gap-1 text-jw-orange">
                ▁▄▇ {progress.chaptersListened}/{totalChapters}
              </span>
              <span className="flex items-center gap-1 text-jw-blue">
                🔖 {progress.savedVocab}
              </span>
              <span className="flex items-center gap-1 text-jw-purple">
                ▦ {progress.soundbitesDone}/{totalSoundbites}
              </span>
            </div>
          </div>

          {/* Story options dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className={`grid h-9 w-9 place-items-center rounded-full text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${
                menuOpen ? 'bg-gray-100 text-gray-600' : ''
              }`}
              aria-label="Story options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              ⋯
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="animate-modal-pop absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl bg-white py-2 shadow-xl ring-1 ring-black/5"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setResetOpen(true);
                  }}
                  className="block w-full px-5 py-3 text-left text-lg text-jw-ink hover:bg-gray-50"
                >
                  Reset story…
                </button>
                <div className="mx-5 my-1 border-t border-gray-100" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setExited(true);
                  }}
                  className="block w-full px-5 py-3 text-left text-lg text-jw-ink hover:bg-gray-50"
                >
                  Exit review
                </button>
              </div>
            )}
          </div>
        </div>

        <Link
          to={`${BASE}/stories/${resume.slug}`}
          className="mt-4 flex items-center justify-between rounded-2xl bg-gray-100 px-5 py-4 hover:bg-gray-200"
        >
          <span>
            <span className="block text-sm text-gray-500">Chapter 1</span>
            <span className="block text-lg font-bold text-jw-ink">
              {resume.chapters[0].title}
            </span>
          </span>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-jw-ink text-lg text-white">
            🎧
          </span>
        </Link>
      </div>

      <ResetModal
        open={resetOpen}
        title={resume.title}
        onCancel={() => setResetOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}
