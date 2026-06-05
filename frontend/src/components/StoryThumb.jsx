// Deterministic placeholder artwork for a story — a colored tile with a simple
// repeating motif derived from the story slug. No images, no randomness.
export default function StoryThumb({ story, size = 'md' }) {
  const dims = {
    sm: 'h-16 w-16',
    md: 'h-28 w-28',
    lg: 'h-44 w-44',
    xl: 'h-72 w-72',
  }[size];

  return (
    <div
      className={`${dims} shrink-0 overflow-hidden rounded-xl`}
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
  );
}
