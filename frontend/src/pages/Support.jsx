import PageMarker from '../components/PageMarker.jsx';

// Dummy destinations — these don't point anywhere real yet.
const DUMMY = '#';

function Lifebuoy() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="#e8833a" strokeWidth="3">
      <circle cx="24" cy="24" r="19" />
      <circle cx="24" cy="24" r="8" />
      <line x1="24" y1="5" x2="24" y2="16" />
      <line x1="24" y1="32" x2="24" y2="43" />
      <line x1="5" y1="24" x2="16" y2="24" />
      <line x1="32" y1="24" x2="43" y2="24" />
    </svg>
  );
}

function ChatBubble() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="#4caf50" strokeWidth="3">
      <path d="M8 10h32a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H22l-8 7v-7H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" />
    </svg>
  );
}

export default function Support() {
  return (
    <div className="mx-auto max-w-5xl px-10 py-10">
      <PageMarker state="support" />

      <h1 className="text-4xl font-extrabold text-jw-ink dark:text-gray-100">
        Support and feedback
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Need help? */}
        <div className="rounded-3xl bg-yellow-50 p-10 text-center dark:bg-yellow-500/10">
          <div className="flex justify-center">
            <Lifebuoy />
          </div>
          <h2 className="mt-5 text-xl font-bold text-jw-ink dark:text-gray-100">Need help?</h2>
          <p className="mt-3 text-lg leading-relaxed text-jw-ink dark:text-gray-200">
            <a href={DUMMY} className="underline hover:text-jw-blue">
              Visit our Help Center
            </a>{' '}
            for answers to common problems. Still need help?{' '}
            <a href={DUMMY} className="underline hover:text-jw-blue">
              Get in touch
            </a>
            . You can also manage your subscription from{' '}
            <a href={DUMMY} className="underline hover:text-jw-blue">
              your account
            </a>
            .
          </p>
        </div>

        {/* Got feedback? */}
        <div className="rounded-3xl bg-green-50 p-10 text-center dark:bg-green-500/10">
          <div className="flex justify-center">
            <ChatBubble />
          </div>
          <h2 className="mt-5 text-xl font-bold text-jw-ink dark:text-gray-100">Got feedback?</h2>
          <p className="mt-3 text-lg leading-relaxed text-jw-ink dark:text-gray-200">
            Let us know how we can improve, and you can be sure it’ll reach the right ears at
            Jiveworld.
          </p>
          <a
            href={DUMMY}
            className="mt-6 inline-block rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white no-underline hover:opacity-90"
          >
            Give feedback on Jiveworld
          </a>
        </div>
      </div>
    </div>
  );
}
