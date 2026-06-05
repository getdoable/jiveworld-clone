import { Link } from 'react-router-dom';
import StoryThumb from './StoryThumb.jsx';

const BASE = '/es-en/app/learn';

// A story card for grids/lists. Renders a real <a href> via <Link>.
export default function StoryCard({ story, layout = 'grid' }) {
  const href = `${BASE}/stories/${story.slug}`;

  if (layout === 'row') {
    return (
      <Link
        to={href}
        className="flex items-start gap-5 border-b border-gray-100 dark:border-gray-800 py-5 hover:bg-gray-50 dark:hover:bg-gray-800"
        data-slug={story.slug}
      >
        <StoryThumb story={story} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-jw-ink dark:text-gray-100">{story.title}</h3>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{story.duration}</span>
            <span className="text-jw-orange">{story.progressLabel}</span>
            <span>{story.soundbitesDone}/{story.chapters.length} Soundbites</span>
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-300">{story.blurb}</p>
          <div className="mt-2 flex flex-wrap gap-2">
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
      </Link>
    );
  }

  return (
    <Link to={href} className="group block" data-slug={story.slug}>
      <div className="overflow-hidden rounded-2xl">
        <div
          className="aspect-square w-full"
          style={{ backgroundColor: story.color }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" className="h-full w-full opacity-60">
            <g fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2">
              <path d="M10 80 L30 40 L50 78 Z" />
              <path d="M40 82 L62 30 L84 80 Z" />
              <circle cx="62" cy="26" r="5" fill="rgba(0,0,0,0.25)" stroke="none" />
            </g>
          </svg>
        </div>
      </div>
      <h3 className="mt-3 text-xl font-bold text-jw-ink dark:text-gray-100 group-hover:text-jw-blue">
        {story.title}
      </h3>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{story.blurb}</p>
      <div className="mt-1 text-sm text-gray-400 dark:text-gray-400">{story.duration}</div>
    </Link>
  );
}
