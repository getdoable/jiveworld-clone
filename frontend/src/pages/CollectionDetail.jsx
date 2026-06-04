import { Link, useParams, Navigate } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import StoryCard from '../components/StoryCard.jsx';
import { getCollection, getCollectionStories } from '../data/stories.js';

const BASE = '/es-en/app/learn';

export default function CollectionDetail() {
  const { slug } = useParams();
  const collection = getCollection(slug);

  if (!collection) {
    return <Navigate to={`${BASE}/collections`} replace />;
  }

  const stories = getCollectionStories(slug);

  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <PageMarker state={`collection:${slug}`} />

      <Link to={`${BASE}/collections`} className="text-jw-blue hover:underline">
        ← Collections
      </Link>

      <div className="mt-6 flex items-start gap-6">
        <div
          className="h-28 w-28 shrink-0 rounded-2xl"
          style={{ backgroundColor: collection.color }}
          aria-hidden="true"
        />
        <div>
          <h1 className="text-4xl font-extrabold text-jw-ink">{collection.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600">{collection.description}</p>
          <p className="mt-2 text-sm text-gray-400">{stories.length} stories</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {stories.map((s) => (
          <StoryCard key={s.slug} story={s} />
        ))}
      </div>
    </div>
  );
}
