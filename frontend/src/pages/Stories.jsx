import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import StoryCard from '../components/StoryCard.jsx';
import { STORIES } from '../data/stories.js';

const BASE = '/es-en/app/learn';

// Status filters shown in the heading dropdown. Each is a real link to a
// distinct URL so the crawler captures every filtered state.
const STATUS_OPTIONS = [
  { key: 'all', label: 'All stories', href: `${BASE}/stories` },
  { key: 'unplayed', label: 'Unplayed', href: `${BASE}/stories?primary=unplayed` },
  { key: 'studyLater', label: 'Study later', href: `${BASE}/stories?primary=studyLater` },
  { key: 'inProgress', label: 'In progress', href: `${BASE}/stories?primary=inProgress` },
  { key: 'completed', label: 'Complete', href: `${BASE}/stories?primary=completed` },
];

// Small status glyph used both in the heading and in the dropdown rows.
function StatusIcon({ statusKey, active }) {
  switch (statusKey) {
    case 'unplayed':
      return <span className="text-xl leading-none text-gray-400">○</span>;
    case 'studyLater':
      return <span className="text-lg leading-none text-gray-400">🕐</span>;
    case 'inProgress':
      return <span className="text-xl leading-none text-gray-400">◐</span>;
    case 'completed':
      return (
        <span
          className={`grid h-6 w-6 place-items-center rounded-full text-sm text-white ${
            active ? 'bg-jw-blue' : 'bg-gray-300'
          }`}
        >
          ✓
        </span>
      );
    default:
      return null;
  }
}

function durationMinutes(s) {
  const m = parseInt(s.duration, 10);
  return Number.isNaN(m) ? 99 : m;
}

// Resolve the active filter + filtered story list from the URL query string.
function applyFilters(search) {
  const params = new URLSearchParams(search);
  const primary = params.get('primary');
  const filterType = params.get('filter_type');
  const filterValue = params.get('filter_value');

  if (primary === 'unplayed')
    return { activeKey: 'unplayed', label: 'Unplayed', stories: STORIES.filter((s) => s.primary === 'unplayed') };
  if (primary === 'inProgress')
    return { activeKey: 'inProgress', label: 'In progress', stories: STORIES.filter((s) => s.primary === 'inProgress') };
  if (primary === 'completed')
    return { activeKey: 'completed', label: 'Complete', stories: STORIES.filter((s) => s.primary === 'completed') };
  if (primary === 'studyLater')
    return { activeKey: 'studyLater', label: 'Study later', stories: STORIES.filter((s) => s.primary === 'studyLater') };

  if (filterType === 'topics' && filterValue === 'Shorts')
    return { activeKey: 'shorts', label: 'Shorts', stories: STORIES.filter((s) => durationMinutes(s) <= 8) };

  if (filterType === 'sb')
    return {
      activeKey: 'sbDone',
      label: filterValue || 'Soundbites',
      stories: STORIES.filter((s) => s.primary === 'completed' && s.soundbitesDone === 0),
    };

  return { activeKey: 'all', label: 'All stories', stories: STORIES };
}

export default function Stories() {
  const location = useLocation();
  const { activeKey, label, stories } = applyFilters(location.search);

  const [menuOpen, setMenuOpen] = useState(false);
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

  // Filter clicks update the URL via the History API (history.pushState) so the
  // crawler captures each filtered state as a distinct URL, then nudge
  // react-router to re-read the location.
  function go(e, href) {
    e.preventDefault();
    setMenuOpen(false);
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  const stateLabel = location.search ? `stories${location.search}` : 'stories';

  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <PageMarker state={stateLabel} />

      {/* Heading + status dropdown + "Show all" */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <StatusIcon statusKey={activeKey} active />
            <h1 className="text-4xl font-extrabold text-jw-ink">{label}</h1>
            <span
              className={`text-2xl text-gray-400 transition-transform ${
                menuOpen ? 'rotate-180' : ''
              }`}
            >
              ⌄
            </span>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="animate-modal-pop absolute left-0 z-30 mt-3 w-64 overflow-hidden rounded-2xl bg-white py-2 shadow-xl ring-1 ring-black/5"
            >
              {STATUS_OPTIONS.map((opt) => {
                const isActive = activeKey === opt.key;
                if (opt.key === 'all') {
                  return (
                    <a
                      key={opt.key}
                      href={opt.href}
                      role="menuitem"
                      onClick={(e) => go(e, opt.href)}
                      className="block border-b border-gray-100 px-5 py-3 text-lg font-semibold text-jw-ink hover:bg-gray-50"
                    >
                      {opt.label}
                    </a>
                  );
                }
                return (
                  <a
                    key={opt.key}
                    href={opt.href}
                    role="menuitem"
                    onClick={(e) => go(e, opt.href)}
                    className={`flex items-center gap-3 px-5 py-3 text-lg hover:bg-gray-50 ${
                      isActive ? 'font-semibold text-jw-blue' : 'text-jw-ink'
                    }`}
                  >
                    <span className="grid w-6 place-items-center">
                      <StatusIcon statusKey={opt.key} active={isActive} />
                    </span>
                    <span className="flex-1">{opt.label}</span>
                    {isActive && <span className="text-xl text-jw-blue">✓</span>}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {activeKey !== 'all' && (
          <a
            href={`${BASE}/stories`}
            onClick={(e) => go(e, `${BASE}/stories`)}
            className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-200"
          >
            Show all
          </a>
        )}

        <span className="ml-auto text-sm text-gray-400">{stories.length} stories</span>
      </div>

      <div className="mt-2 border-b border-gray-100 pb-2">
        <a href="#" className="inline-flex items-center gap-2 py-3 text-jw-blue hover:underline">
          🎧 My podcast feed
        </a>
      </div>

      <div className="mt-2">
        {stories.map((s) => (
          <StoryCard key={s.slug} story={s} layout="row" />
        ))}
        {stories.length === 0 && (
          <p className="py-10 text-gray-500">No stories match this filter.</p>
        )}
      </div>
    </div>
  );
}
