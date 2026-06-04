import { Link } from 'react-router-dom';
import PageMarker from '../components/PageMarker.jsx';
import StoryCard from '../components/StoryCard.jsx';
import { getUser } from '../lib/auth.js';
import { HOME_IN_PROGRESS, HOME_COMPLETED, HOME_STUDY_LATER } from '../data/stories.js';

const BASE = '/es-en/app/learn';

function Section({ title, showAllHref, stories }) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-bold text-jw-ink">{title}</h2>
        <Link to={showAllHref} className="text-jw-blue hover:underline">
          Show all
        </Link>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s) => (
          <StoryCard key={s.slug} story={s} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const user = getUser();

  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <PageMarker state="home" />

      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-jw-ink">Hola, {user.name}</h1>
        <div className="flex items-center gap-2 text-2xl font-bold text-jw-ink">
          <span className="text-jw-gold">★</span>
          <span>22</span>
        </div>
      </header>

      <Section
        title="All in progress"
        showAllHref={`${BASE}/stories?primary=inProgress`}
        stories={HOME_IN_PROGRESS}
      />

      <Section
        title="Completed stories"
        showAllHref={`${BASE}/stories?primary=completed`}
        stories={HOME_COMPLETED}
      />

      <Section
        title="Study later"
        showAllHref={`${BASE}/stories?primary=studyLater`}
        stories={HOME_STUDY_LATER}
      />

      <section className="mt-12">
        <Link
          to="#"
          className="flex items-center justify-between rounded-2xl bg-gray-50 px-6 py-5 hover:bg-gray-100"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-jw-blue text-white">
              🎧
            </span>
            <div>
              <div className="text-lg font-bold text-jw-ink">My podcast feed</div>
              <div className="text-gray-500">
                Everything you’re studying in Jiveworld, in your favorite podcast app.
              </div>
            </div>
          </div>
          <span className="text-2xl text-gray-400">›</span>
        </Link>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-jw-ink">Collections</h2>
          <Link to={`${BASE}/collections`} className="text-jw-blue hover:underline">
            Show all
          </Link>
        </div>
        <Link
          to={`${BASE}/collections/ciudad`}
          className="mt-5 block overflow-hidden rounded-2xl border border-gray-100"
        >
          <div className="flex items-center gap-5 p-5">
            <div
              className="h-24 w-24 shrink-0 rounded-xl"
              style={{ backgroundColor: '#3aa7d4' }}
              aria-hidden="true"
            />
            <div>
              <div className="text-xl font-bold text-jw-ink">Códigos urbanos</div>
              <div className="text-gray-500">Unraveling Latin American cities · 4 stories</div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
