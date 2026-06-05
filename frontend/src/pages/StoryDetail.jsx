import { useState } from 'react';
import { Link, useLocation, useParams, Navigate } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import StoryCard from '../components/StoryCard.jsx';
import { getStory, getRelatedStories, getCollection, SOUNDBITES, GAMES } from '../data/stories.js';

const BASE = '/es-en/app/learn';

function ActionButton({ children, primary }) {
  return (
    <button
      type="button"
      className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
        primary
          ? 'bg-jw-ink text-white hover:bg-black'
          : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-500'
      }`}
    >
      {children}
    </button>
  );
}

function ChapterRow({ chapter }) {
  const done = chapter.status === 'Done';
  return (
    <li className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 py-4">
      <span
        className={`grid h-7 w-7 place-items-center rounded-full text-sm ${
          done ? 'bg-jw-blue text-white' : 'border-2 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-400'
        }`}
      >
        {done ? '✓' : chapter.n}
      </span>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-400">
          Chapter {chapter.n}
        </div>
        <div className="font-semibold text-jw-ink dark:text-gray-100">{chapter.title}</div>
      </div>
      <span className="text-sm text-gray-400 dark:text-gray-400">{chapter.duration}</span>
      <span
        className={`w-24 text-right text-sm font-semibold ${
          done ? 'text-jw-blue' : 'text-jw-orange'
        }`}
      >
        {chapter.status}
      </span>
    </li>
  );
}

export default function StoryDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const story = getStory(slug);

  const soundbitesParam = new URLSearchParams(location.search).get('soundbites');
  const [sbOpen, setSbOpen] = useState(soundbitesParam === '1');

  if (!story) {
    return <Navigate to={`${BASE}/stories`} replace />;
  }

  const related = getRelatedStories(slug);
  const collection = story.inCollection ? getCollection(story.inCollection) : null;
  const stateLabel = soundbitesParam === '1' ? `story:${slug}:soundbites` : `story:${slug}`;

  return (
    <div className="mx-auto max-w-6xl px-10 py-10">
      <PageMarker state={stateLabel} />

      <Link to={`${BASE}/stories`} className="text-jw-blue hover:underline">
        ← All stories
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div>
          <div className="flex items-start gap-6">
            <div
              className="h-44 w-44 shrink-0 rounded-2xl"
              style={{ backgroundColor: story.color }}
              aria-hidden="true"
            />
            <div>
              <h1 className="text-4xl font-extrabold text-jw-ink dark:text-gray-100">{story.title}</h1>
              <div className="mt-1 text-gray-500 dark:text-gray-400">{story.author}</div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {story.duration} · {story.chapters.length} chapters
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {story.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">{story.description}</p>

          {/* Placeholder audio player */}
          <div className="mt-6">
            <audio controls className="w-full" src={`/media/${story.slug}.mp3`}>
              Your browser does not support the audio element.
            </audio>
          </div>

          {/* Primary actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionButton primary>Begin story</ActionButton>
            <ActionButton>Relisten</ActionButton>
            <ActionButton>Reset</ActionButton>
            <ActionButton>Manage list</ActionButton>
            <ActionButton>Give feedback on this story</ActionButton>
          </div>

          {/* Chapters */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">Chapters</h2>
            <ul className="mt-3">
              {story.chapters.map((c) => (
                <ChapterRow key={c.n} chapter={c} />
              ))}
            </ul>
          </section>

          {/* Soundbites & Games */}
          <section className="mt-10" id="soundbites">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">Soundbites &amp; Games</h2>
              <button
                type="button"
                onClick={() => setSbOpen((v) => !v)}
                className="text-sm font-semibold text-jw-blue hover:underline"
                aria-expanded={sbOpen}
              >
                {sbOpen ? 'Collapse' : 'Expand'}
              </button>
            </div>
            <div className="mt-2 flex gap-6 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <span className="text-jw-orange">0/7 Soundbites</span>
              <span className="text-jw-purple">0/9 Games</span>
            </div>

            {sbOpen && (
              <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-jw-orange">
                    Soundbites
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {SOUNDBITES.map((sb) => (
                      <li
                        key={sb}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-800 px-4 py-3"
                      >
                        <span className="text-jw-orange">▮▮▮</span>
                        <span className="font-medium text-jw-ink dark:text-gray-100">{sb}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-jw-purple">
                    Games
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {GAMES.map((g) => (
                      <li
                        key={g}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-800 px-4 py-3"
                      >
                        <span className="text-jw-purple">◆</span>
                        <span className="font-medium text-jw-ink dark:text-gray-100">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Collection */}
          {collection && (
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">Collection</h2>
              <Link
                to={`${BASE}/collections/${collection.slug}`}
                className="mt-3 flex items-center gap-4 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div
                  className="h-16 w-16 shrink-0 rounded-xl"
                  style={{ backgroundColor: collection.color }}
                  aria-hidden="true"
                />
                <div>
                  <div className="font-bold text-jw-ink dark:text-gray-100">{collection.shortTitle}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{collection.title}</div>
                </div>
              </Link>
            </section>
          )}

          {/* Related stories */}
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-jw-ink dark:text-gray-100">Related stories</h2>
            <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {related.map((s) => (
                <StoryCard key={s.slug} story={s} />
              ))}
            </div>
          </section>
        </div>

        {/* Right sidebar: My story progress */}
        <aside className="lg:pt-1">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-6">
            <h2 className="text-lg font-bold text-jw-ink dark:text-gray-100">My story progress</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="font-semibold text-jw-ink dark:text-gray-100">{story.progressLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Chapters done</span>
                <span className="font-semibold text-jw-ink dark:text-gray-100">
                  {story.chapters.filter((c) => c.status === 'Done').length}/
                  {story.chapters.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Soundbites</span>
                <span className="font-semibold text-jw-ink dark:text-gray-100">0/7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Games</span>
                <span className="font-semibold text-jw-ink dark:text-gray-100">0/9</span>
              </div>
            </div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-jw-blue"
                style={{
                  width: `${
                    (story.chapters.filter((c) => c.status === 'Done').length /
                      story.chapters.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
