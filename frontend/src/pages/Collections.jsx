import { Link } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import { COLLECTIONS, getCollectionStories } from '../data/stories.js';

const BASE = '/es-en/app/learn';

export default function Collections() {
  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <PageMarker state="collections" />
      <h1 className="text-4xl font-extrabold text-jw-ink dark:text-gray-100">Collections</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Curated sets of stories, grouped by theme.</p>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {COLLECTIONS.map((c) => {
          const count = getCollectionStories(c.slug).length;
          return (
            <Link
              key={c.slug}
              to={`${BASE}/collections/${c.slug}`}
              className="group block overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-sm"
            >
              <div
                className="aspect-[16/9] w-full"
                style={{ backgroundColor: c.color }}
                aria-hidden="true"
              />
              <div className="p-5">
                <h2 className="text-xl font-bold text-jw-ink dark:text-gray-100 group-hover:text-jw-blue">
                  {c.shortTitle}
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-300">{c.title}</p>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-400">{count} stories</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
