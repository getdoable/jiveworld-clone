import PageMarker from '../components/PageMarker.jsx';
import StoryCard from '../components/StoryCard.jsx';
import { STORIES } from '../data/stories.js';

// Static, deterministic weekly bar data (heights in %).
const LAST_WEEK_BARS = [0, 70, 0, 100, 0, 0, 0];
const DAY_LABELS = ['F', 'S', 'S', 'M', 'T', 'W', 'T'];

const completed = STORIES.filter((s) => s.primary === 'completed');

function StatTile({ value, label, bg }) {
  return (
    <div className={`rounded-2xl ${bg} p-6 text-center`}>
      <div className="text-3xl font-extrabold text-jw-ink">{value}</div>
      <div className="mt-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </div>
    </div>
  );
}

export default function Progress() {
  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <PageMarker state="progress" />
      <h1 className="text-4xl font-extrabold text-jw-ink">My stats</h1>

      {/* Top row: weekly points + current streak */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                <span className="mt-2 text-xs text-gray-400">{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 p-6">
          <div className="text-sm font-semibold text-jw-ink">Current streak</div>
          <div className="mt-1 flex items-center gap-1 text-2xl font-bold text-jw-ink">
            <span className="text-jw-orange">🔥</span>0
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="font-semibold text-gray-400">
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <div
                key={d}
                className={`rounded-full py-1 ${d === 4 ? 'border border-jw-orange' : ''}`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Headline stat tiles */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatTile value="22" label="Total points" bg="bg-yellow-50" />
        <StatTile value="1 day" label="Longest streak" bg="bg-orange-50" />
        <StatTile value="2" label="Days with study" bg="bg-sky-50" />
      </div>

      {/* Detailed stat grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatTile value="0m" label="Listened" bg="bg-sky-50" />
        <StatTile value="3" label="Stories completed" bg="bg-sky-50" />
        <StatTile value="35" label="Chapters completed" bg="bg-sky-50" />
        <StatTile value="0" label="Vocab learned" bg="bg-green-50" />
        <StatTile value="0" label="Vocab to review" bg="bg-purple-50" />
        <StatTile value="0" label="Soundbites completed" bg="bg-orange-50" />
      </div>

      {/* Recently completed stories */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-jw-ink">Recently completed</h2>
        <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {completed.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
