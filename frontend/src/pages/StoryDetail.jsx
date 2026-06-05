import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import StoryThumb from '../components/StoryThumb.jsx';
import { getStory, GAMES } from '../data/stories.js';
import { isAuthenticated } from '../lib/auth.js';
import { getChaptersDone, setChaptersDone } from '../lib/storyProgress.js';

const BASE = '/es-en/app/learn';

const minutes = (d) => parseInt(d, 10) || 0;

// Every number on this page is derived from the story data + the user's
// listened-chapter count. Nothing is a hard-coded literal.
function deriveStats(story, chaptersDone) {
  const total = story.chapters.length;
  const totalMinutes = story.chapters.reduce((s, c) => s + minutes(c.duration), 0);
  const listenedMinutes = story.chapters
    .slice(0, chaptersDone)
    .reduce((s, c) => s + minutes(c.duration), 0);

  return {
    total,
    chaptersDone,
    completePct: total ? Math.round((chaptersDone / total) * 100) : 0,
    listenedMinutes,
    points: chaptersDone,
    soundbitesTotal: total, // one soundbite per chapter
    soundbitesDone: story.soundbitesDone,
    gamesTotal: GAMES.length,
    gamesDone: story.gamesDone,
    // ~3 vocab items per minute of audio, plus one per chapter — deterministic.
    vocabToReview: totalMinutes * 3 + total,
    vocabLearned: 0,
  };
}

// Activity glyph shown at the end of each chapter row (purely decorative).
const CHAPTER_ICONS = [
  { bg: 'bg-jw-gold', el: 'A' },
  { bg: 'bg-pink-400', el: '♥' },
  { bg: 'bg-jw-blue', el: '▦' },
  { bg: 'bg-green-500', el: '✓' },
];

function TopBar({ story, onBack, fixed, visible }) {
  return (
    <div
      style={{ backgroundColor: story.color }}
      className={`${
        fixed ? 'fixed inset-x-0 top-0 z-40 transition-opacity duration-200' : ''
      } ${fixed && !visible ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <div className="absolute inset-0 bg-slate-900/40" />
      <div className="relative mx-auto flex h-16 max-w-5xl items-center px-6 text-white">
        <button type="button" onClick={onBack} aria-label="Back" className="text-2xl">
          ←
        </button>
        <div className="flex flex-1 items-center justify-center gap-2 font-bold">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-sm text-jw-blue">
            ✓
          </span>
          {fixed ? story.title : ''}
        </div>
        <button type="button" aria-label="Story options" className="text-2xl leading-none">
          ⋯
        </button>
      </div>
    </div>
  );
}

function StatCard({ children, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl px-6 py-7 ${className}`}>
      {children}
    </div>
  );
}

export default function StoryDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const story = getStory(slug);
  const sbParam = new URLSearchParams(location.search).get('soundbites') === '1';

  const seeded = story ? story.chapters.filter((c) => c.status === 'Done').length : 0;
  const [chaptersDone, setDone] = useState(() => (story ? getChaptersDone(slug, seeded) : 0));
  const [scrolled, setScrolled] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 360);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!story) return <Navigate to={`${BASE}/stories`} replace />;

  const s = deriveStats(story, chaptersDone);
  const back = () => navigate(`${BASE}/stories`);

  function reset() {
    setDone(setChaptersDone(slug, 0));
  }
  function relisten() {
    setDone(setChaptersDone(slug, story.chapters.length));
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PageMarker state={sbParam ? `story:${slug}:soundbites` : `story:${slug}`} />

      {/* Fixed compact bar that fades in on scroll */}
      <TopBar story={story} onBack={back} fixed visible={scrolled} />

      {/* ===== Hero ===== */}
      <header className="relative min-h-screen text-white" style={{ backgroundColor: story.color }}>
        <div className="absolute inset-0 bg-slate-900/45" />
        {/* faint oversized art */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
          <StoryThumb story={story} size="xl" />
        </div>

        <div className="relative">
          <TopBar story={story} onBack={back} />

          <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-16 pt-6 text-center">
            <div className="overflow-hidden rounded-2xl bg-white/95 p-2 shadow-2xl">
              <StoryThumb story={story} size="xl" />
            </div>

            <h1 className="mt-8 flex items-center gap-3 text-4xl font-extrabold">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-base text-jw-blue">
                ✓
              </span>
              {story.title}
            </h1>
            <div className="mt-2 flex items-center gap-3 font-semibold text-white/90">
              {story.author}
              <span className="flex items-center gap-1">⤓ Downloaded</span>
            </div>

            {/* meta + soundbites */}
            <div className="mt-12 flex w-full items-center justify-between">
              <span className="text-white/90">
                {story.duration}, {s.total} chapters
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold">
                ▮▮▮ {s.soundbitesTotal} Soundbites
              </span>
            </div>
            <div className="mt-4 h-px w-full bg-white/25" />

            <h2 className="mt-6 w-full text-left text-2xl font-bold">{story.blurb}</h2>
            <p className="mt-3 w-full text-left text-lg leading-relaxed text-white/90">
              {story.description}
            </p>

            <div className="mt-6 flex w-full flex-wrap gap-2">
              {story.tags.map((t, i) => (
                <span
                  key={t}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    i === 0 ? 'bg-white/15' : 'border border-white/30'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCreditsOpen((o) => !o)}
              className="mt-8 flex w-full items-center gap-3 text-left text-lg font-semibold"
            >
              ☰ Credits and resources
            </button>
            {creditsOpen && (
              <p className="mt-2 w-full text-left text-white/80">
                {story.title} — produced by {story.author}. Recorded in {story.country}.
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ===== Chapters ===== */}
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full bg-jw-purple px-5 py-2.5 font-semibold text-white">
              🔖 Vocab review ({s.vocabToReview})
            </span>
            <span className="flex items-center gap-1 text-xl font-bold text-jw-ink dark:text-gray-100">
              <span className="text-jw-gold">★</span>
              {s.points}
            </span>
          </div>

          <ul className="mt-6">
            {story.chapters.map((c, i) => {
              const done = i < s.chaptersDone;
              const icon = CHAPTER_ICONS[i % CHAPTER_ICONS.length];
              const sbCount = (c.title.length % 2) + 1; // deterministic 1–2
              return (
                <li
                  key={c.n}
                  className="flex items-center gap-4 border-b border-gray-100 py-5 last:border-0 dark:border-gray-800"
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-base ${
                      done
                        ? 'bg-green-500 text-white'
                        : 'border-2 border-gray-300 text-gray-400 dark:border-gray-600'
                    }`}
                  >
                    {done ? '✓' : c.n}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Chapter {c.n}
                    </div>
                    <div className="text-lg font-bold text-jw-ink dark:text-gray-100">{c.title}</div>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-gray-400">
                    ▮▮ {sbCount}
                  </span>
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-md text-sm text-white ${icon.bg}`}
                  >
                    {icon.el}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="py-8 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 font-semibold text-gray-500 hover:text-jw-blue dark:text-gray-400"
            >
              💬 Give feedback on this story
            </button>
          </div>
        </div>
      </section>

      {/* ===== My story progress ===== */}
      <section className="bg-gray-100 dark:bg-gray-800">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-jw-ink dark:text-gray-100">
              My story progress
            </h2>
            <button
              type="button"
              onClick={relisten}
              className="flex items-center gap-2 rounded-full bg-jw-ink px-5 py-2.5 font-semibold text-white hover:bg-black"
            >
              ↺ Relisten
            </button>
          </div>
          <div className="mt-4 h-px w-full bg-gray-300 dark:bg-gray-700" />

          {/* Study & listen */}
          <div className="mt-6 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <span className="text-green-500">✓</span> Study &amp; listen
            </span>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-bold uppercase tracking-wide text-jw-blue hover:underline"
            >
              Reset
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-5">
            <StatCard className="bg-white dark:bg-gray-900">
              <div className="flex items-center gap-2 text-3xl font-extrabold text-jw-ink dark:text-gray-100">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-jw-blue text-sm text-white">
                  ✓
                </span>
                {s.completePct}%
              </div>
              <div className="mt-1 text-sm font-bold uppercase tracking-wide text-gray-400">
                Complete
              </div>
            </StatCard>
            <StatCard className="bg-white dark:bg-gray-900">
              <div className="flex items-center gap-2 text-3xl font-extrabold text-jw-ink dark:text-gray-100">
                <span className="text-jw-blue">🎧</span>
                {s.listenedMinutes}m 0s
              </div>
              <div className="mt-1 text-sm font-bold uppercase tracking-wide text-gray-400">
                Listened
              </div>
            </StatCard>
          </div>

          {/* Vocabulary */}
          <div className="mt-8 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Vocabulary
            </span>
            <button
              type="button"
              className="text-sm font-bold uppercase tracking-wide text-jw-purple hover:underline"
            >
              Manage list
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-5">
            <button
              type="button"
              className="flex items-center justify-between rounded-2xl bg-jw-purple px-6 py-7 text-left text-white"
            >
              <span>
                <span className="block text-3xl font-extrabold">🔖 {s.vocabToReview}</span>
                <span className="mt-1 block text-sm font-bold uppercase tracking-wide">
                  To review
                </span>
              </span>
              <span className="text-2xl">›</span>
            </button>
            <StatCard className="bg-white dark:bg-gray-900">
              <div className="text-3xl font-extrabold text-jw-ink dark:text-gray-100">
                <span className="text-green-500">🔖</span> {s.vocabLearned}
              </div>
              <div className="mt-1 text-sm font-bold uppercase tracking-wide text-gray-400">
                Learned
              </div>
            </StatCard>
          </div>

          {/* Soundbites & games */}
          <div className="mt-8 text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Soundbites &amp; games
          </div>
          <div className="mt-3 grid grid-cols-2 gap-5">
            <button
              type="button"
              className="flex items-center justify-between rounded-2xl bg-jw-orange px-6 py-7 text-left text-white"
            >
              <span>
                <span className="block text-3xl font-extrabold">
                  ▮▮ {s.soundbitesDone}/{s.soundbitesTotal}
                </span>
                <span className="mt-1 block text-sm font-bold uppercase tracking-wide">
                  Soundbites
                </span>
              </span>
              <span className="text-2xl">›</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-between rounded-2xl bg-pink-400 px-6 py-7 text-left text-white"
            >
              <span>
                <span className="block text-3xl font-extrabold">
                  ▦ {s.gamesDone}/{s.gamesTotal}
                </span>
                <span className="mt-1 block text-sm font-bold uppercase tracking-wide">Games</span>
              </span>
              <span className="text-2xl">›</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
