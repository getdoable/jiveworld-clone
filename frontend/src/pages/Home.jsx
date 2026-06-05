import { Link } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import StoryThumb from '../components/StoryThumb.jsx';
import { getUser } from '../lib/auth.js';
import { STORIES, SOUNDBITES } from '../data/stories.js';

const BASE = '/es-en/app/learn';

// Headline counters shown next to the greeting.
const STREAK = 1;
const POINTS = 23;

// Derived progress counts from the story data.
const inProgress = STORIES.filter((s) => s.primary === 'inProgress');
const completed = STORIES.filter((s) => s.primary === 'completed');
const studyLater = STORIES.filter((s) => s.primary === 'studyLater');

// The story to resume — first one still in progress.
const resume = inProgress[0] || STORIES[0];

// Weekly points chart: two weeks of daily bars (height %, label, week).
const WEEK_BARS = [
  { h: 78, value: 8, week: 'last' },
  { h: 0, week: 'last' },
  { h: 0, week: 'last' },
  { h: 100, value: 12, week: 'last' },
  { h: 0, week: 'last' },
  { h: 0, week: 'last' },
  { h: 0, week: 'last' },
  { h: 0, week: 'this' },
  { h: 0, week: 'this' },
  { h: 0, week: 'this' },
  { h: 0, week: 'this' },
  { h: 0, week: 'this' },
  { h: 0, week: 'this' },
  { h: 12, value: 1, week: 'this' },
];
const DAY_LABELS = ['S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F'];

function ProgressRow({ icon, label, count, to, indent }) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between border-b border-gray-100 py-3 last:border-0 hover:bg-gray-100/60 ${
        indent ? 'pl-8' : ''
      }`}
    >
      <span className="flex items-center gap-3">
        {icon && <span className="w-5 text-center text-lg">{icon}</span>}
        <span className="text-lg font-medium text-jw-ink">{label}</span>
      </span>
      <span className="flex items-center gap-2 text-lg text-gray-400">
        {count}
        <span className="text-gray-300">›</span>
      </span>
    </Link>
  );
}

export default function Home() {
  const user = getUser();

  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <PageMarker state="home" />

      {/* Greeting + headline counters */}
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-jw-ink">Hola, {user.name}</h1>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-2xl font-bold text-jw-ink">
            <span className="text-jw-orange">🔥</span>
            {STREAK}
          </span>
          <Link
            to={`${BASE}/progress`}
            className="flex items-center gap-2 text-2xl font-bold text-jw-ink hover:underline"
          >
            <span className="text-jw-gold">★</span>
            {POINTS}
          </Link>
        </div>
      </header>

      {/* Where you were — resume card */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between border-b border-gray-100 pb-3">
          <h2 className="text-2xl font-bold text-jw-ink">Where you were</h2>
          <Link
            to={`${BASE}/stories?primary=inProgress`}
            className="text-jw-blue hover:underline"
          >
            All in progress
          </Link>
        </div>

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
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gray-300 text-sm text-white">
                    ✓
                  </span>
                  {resume.title}
                </Link>
                <div className="mt-1 flex items-center gap-4 text-sm font-semibold text-gray-500">
                  <span>{resume.duration}</span>
                  <span className="flex items-center gap-1 text-jw-orange">
                    ▁▄▇ {resume.chapters.length}
                  </span>
                  <span className="flex items-center gap-1 text-jw-purple">
                    ▦ {resume.soundbitesDone}/{SOUNDBITES.length}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="px-2 text-2xl leading-none text-gray-400 hover:text-gray-600"
                aria-label="Story options"
              >
                ⋯
              </button>
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
        </div>
      </section>

      {/* Two-column: progress list + weekly chart */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Progress filters */}
        <div className="rounded-2xl bg-gray-50 p-4">
          <ProgressRow
            icon={<span className="text-jw-orange">🕐</span>}
            label="Study later"
            count={studyLater.length}
            to={`${BASE}/stories?primary=studyLater`}
          />
          <ProgressRow
            icon={<span className="text-jw-blue">◐</span>}
            label="In progress"
            count={inProgress.length}
            to={`${BASE}/stories?primary=inProgress`}
          />
          <ProgressRow
            icon={
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gray-300 text-xs text-white">
                ✓
              </span>
            }
            label="Completed stories"
            count={completed.length}
            to={`${BASE}/stories?primary=completed`}
          />
          <ProgressRow
            label="…with unplayed Soundbites"
            count={completed.length}
            to={`${BASE}/stories?primary=completed`}
            indent
          />
          <ProgressRow
            label="…with unplayed games"
            count={completed.length}
            to={`${BASE}/stories?primary=completed`}
            indent
          />
          <ProgressRow
            icon={<span className="text-jw-purple">〰️</span>}
            label="Find Soundbites I've done"
            count={0}
            to={`${BASE}/stories?primary=completed`}
          />
        </div>

        {/* Weekly points chart */}
        <div className="rounded-2xl bg-gray-50 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-400">Last week</div>
              <div className="mt-1 flex items-center gap-1 text-2xl font-bold text-gray-400">
                <span className="text-jw-gold">★</span>22
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-jw-ink">This week</div>
              <div className="mt-1 flex items-center justify-end gap-1 text-2xl font-bold text-jw-ink">
                <span className="text-jw-gold">★</span>
                {POINTS - 22}
              </div>
            </div>
          </div>

          <div className="mt-8 flex h-40 items-end justify-between gap-1">
            {WEEK_BARS.map((b, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
                {b.value ? (
                  <span className="mb-1 text-xs font-semibold text-gray-500">{b.value}</span>
                ) : null}
                <div
                  className={`w-3 rounded-md ${
                    b.week === 'this' ? 'bg-jw-gold' : 'bg-jw-gold/40'
                  }`}
                  style={{ height: `${b.h}%` }}
                  aria-hidden="true"
                />
                <span className="mt-2 text-xs text-gray-400">{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
