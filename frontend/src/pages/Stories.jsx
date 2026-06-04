import { Link, useLocation } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import StoryCard from '../components/StoryCard.jsx';
import { STORIES } from '../data/stories.js';

const BASE = '/es-en/app/learn';

// Filter definitions. Each filter is a real link to a distinct URL.
const FILTERS = [
  { key: 'inProgress', label: 'All in progress', href: `${BASE}/stories?primary=inProgress` },
  { key: 'completed', label: 'Completed stories', href: `${BASE}/stories?primary=completed` },
  {
    key: 'shorts',
    label: 'Shorts',
    href: `${BASE}/stories?filter_type=topics&filter_value=Shorts`,
  },
  {
    key: 'sbDone',
    label: "Find Soundbites I've done",
    href: `${BASE}/stories?filter_type=sb&filter_value=Completed+stories+with+unplayed+Soundbites`,
  },
];

const REMOVE_HREF = `${BASE}/stories`;

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

  if (primary === 'inProgress')
    return { activeKey: 'inProgress', label: 'In progress', stories: STORIES.filter((s) => s.primary === 'inProgress') };
  if (primary === 'completed')
    return { activeKey: 'completed', label: 'Completed', stories: STORIES.filter((s) => s.primary === 'completed') };
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

  return { activeKey: null, label: 'All stories', stories: STORIES };
}

export default function Stories() {
  const location = useLocation();
  const { activeKey, label, stories } = applyFilters(location.search);

  // Filter clicks update the URL via the History API (history.pushState) so the
  // crawler captures each filtered state as a distinct URL, then nudge
  // react-router to re-read the location.
  function go(e, href) {
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  const stateLabel = location.search ? `stories${location.search}` : 'stories';

  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <PageMarker state={stateLabel} />

      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-extrabold text-jw-ink">{label}</h1>
        <span className="text-2xl text-gray-300">⌄</span>
      </div>

      {/* Filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-gray-100 pb-5">
        {FILTERS.map((f) => (
          <a
            key={f.key}
            href={f.href}
            onClick={(e) => go(e, f.href)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              activeKey === f.key
                ? 'border-jw-blue bg-jw-blue text-white'
                : 'border-gray-300 text-gray-700 hover:border-jw-blue hover:text-jw-blue'
            }`}
          >
            {f.label}
          </a>
        ))}
        <a
          href={REMOVE_HREF}
          onClick={(e) => go(e, REMOVE_HREF)}
          className="ml-1 text-sm font-semibold text-gray-400 hover:text-gray-700"
        >
          remove filters
        </a>

        <span className="ml-auto text-sm text-gray-400">{stories.length} stories</span>
      </div>

      <div className="mt-2">
        <Link to="#" className="inline-flex items-center gap-2 py-3 text-jw-blue hover:underline">
          🎧 My podcast feed
        </Link>
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
