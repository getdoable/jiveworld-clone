import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import StoryCard from '../components/StoryCard.jsx';
import StreakCalendar from '../components/StreakCalendar.jsx';
import { fetchActivity } from '../lib/api.js';
import { STORIES } from '../data/stories.js';

const BASE = '/es-en/app/learn';

// Static, deterministic weekly bar data (heights in %).
const LAST_WEEK_BARS = [0, 70, 0, 100, 0, 0, 0];
const DAY_LABELS = ['F', 'S', 'S', 'M', 'T', 'W', 'T'];

const completed = STORIES.filter((s) => s.primary === 'completed');

function StatTile({ value, label, bg, to }) {
  const inner = (
    <>
      <div className="text-3xl font-extrabold text-jw-ink dark:text-gray-100">{value}</div>
      <div className="mt-1 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`block rounded-2xl ${bg} p-6 text-center no-underline transition hover:brightness-95`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={`rounded-2xl ${bg} p-6 text-center`}>{inner}</div>;
}

export default function Progress() {
  const [activity, setActivity] = useState({ streak: 0, activeDays: [] });

  useEffect(() => {
    let cancelled = false;
    fetchActivity()
      .then((data) => {
        if (!cancelled) setActivity(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <PageMarker state="progress" />
      <h1 className="text-4xl font-extrabold text-jw-ink dark:text-gray-100">My stats</h1>

      {/* Top row: weekly points + current streak */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-400 dark:text-gray-400">Last week</div>
              <div className="mt-1 flex items-center gap-1 text-2xl font-bold text-gray-400 dark:text-gray-400">
                <span className="text-jw-gold">★</span>22
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-jw-ink dark:text-gray-100">This week</div>
              <div className="mt-1 flex items-center justify-end gap-1 text-2xl font-bold text-jw-ink dark:text-gray-100">
                <span className="text-jw-gold">★</span>0
              </div>
            </div>
          </div>

          {/* Static bar graph (styled divs) */}
          <div className="mt-8 flex h-40 items-end justify-between gap-2">
            {LAST_WEEK_BARS.map((h, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
                <div
                  className="w-3 rounded-full bg-jw-gold"
                  style={{ height: `${h}%` }}
                  aria-hidden="true"
                />
                <span className="mt-2 text-xs text-gray-400 dark:text-gray-400">{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <StreakCalendar
          streak={activity.streak}
          activeDays={new Set(activity.activeDays)}
        />
      </div>

      {/* Headline stat tiles */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatTile value={String(completed.length)} label="Total points" bg="bg-yellow-50 dark:bg-yellow-500/10" />
        <StatTile value="1 day" label="Longest streak" bg="bg-orange-50 dark:bg-orange-500/10" />
        <StatTile value="2" label="Days with study" bg="bg-sky-50 dark:bg-sky-500/10" />
      </div>

      {/* Detailed stat grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatTile value="0m" label="Listened" bg="bg-sky-50 dark:bg-sky-500/10" />
        <StatTile
          value="3"
          label="Stories completed"
          bg="bg-sky-50 dark:bg-sky-500/10"
          to={`${BASE}/stories?primary=completed`}
        />
        <StatTile value="35" label="Chapters completed" bg="bg-sky-50 dark:bg-sky-500/10" />
        <StatTile value="0" label="Vocab learned" bg="bg-green-50 dark:bg-green-500/10" />
        <StatTile value="0" label="Vocab to review" bg="bg-purple-50 dark:bg-purple-500/10" />
        <StatTile value="0" label="Soundbites completed" bg="bg-orange-50 dark:bg-orange-500/10" />
      </div>

      {/* Recently completed stories */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">Recently completed</h2>
        <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {completed.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
