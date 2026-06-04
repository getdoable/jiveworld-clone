// The Jiveworld "jw" wave wordmark, rebuilt as inline SVG.
export default function Logo({ showWord = true }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-label="Jiveworld">
        <path
          d="M2 16 C5 6, 8 6, 10 14 C12 22, 15 22, 17 12"
          stroke="#3aa7d4"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 13 C18 4, 21 4, 23 12 C25 20, 28 20, 31 9"
          stroke="#f2c849"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M9 13 C11 22, 14 22, 16 13"
          stroke="#5cc26a"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {showWord && (
        <span className="tracking-[0.18em] text-sm font-semibold text-gray-600">ESPAÑOL</span>
      )}
    </div>
  );
}
