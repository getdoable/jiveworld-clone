import { useEffect, useRef, useState } from 'react';

// A single label-style dropdown (Country / Topic / Soundbites).
function FilterDropdown({ placeholder, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const active = Boolean(value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 text-lg font-semibold ${
          active
            ? 'text-jw-blue'
            : 'text-gray-500 hover:text-jw-ink dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        {active ? selected.label : placeholder}
        <span className={`text-base transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>

      {open && (
        <div className="animate-modal-pop absolute left-0 z-30 mt-2 max-h-72 w-56 overflow-y-auto rounded-2xl bg-white py-2 shadow-xl ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
          {options.map((opt) => {
            const isSel = opt.value === value;
            return (
              <button
                key={opt.value || 'all'}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-5 py-2.5 text-left text-base hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  isSel ? 'font-semibold text-jw-blue' : 'text-jw-ink dark:text-gray-100'
                }`}
              >
                {opt.label}
                {isSel && <span className="text-jw-blue">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function StoryFilterBar({ countries, topics, filters, setFilters, count }) {
  const [searchOpen, setSearchOpen] = useState(Boolean(filters.search));
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));

  const countryOptions = [
    { value: '', label: 'All countries' },
    ...countries.map((c) => ({ value: c, label: c })),
  ];
  const topicOptions = [
    { value: '', label: 'All topics' },
    ...topics.map((t) => ({ value: t, label: t })),
  ];
  const soundbiteOptions = [
    { value: '', label: 'All' },
    { value: 'unplayed', label: 'Unplayed Soundbites' },
    { value: 'completed', label: 'Soundbites completed' },
  ];

  // Sort cycles: off → shortest first → longest first → off.
  function cycleSort() {
    set({ sort: filters.sort === 'asc' ? 'desc' : filters.sort === 'desc' ? null : 'asc' });
  }
  const sortArrow = filters.sort === 'asc' ? '↑' : filters.sort === 'desc' ? '↓' : '⇅';

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-gray-100 pb-4 dark:border-gray-800">
      <FilterDropdown
        placeholder="Country"
        value={filters.country}
        options={countryOptions}
        onChange={(v) => set({ country: v })}
      />
      <FilterDropdown
        placeholder="Topic"
        value={filters.topic}
        options={topicOptions}
        onChange={(v) => set({ topic: v })}
      />
      <FilterDropdown
        placeholder="Soundbites"
        value={filters.soundbites}
        options={soundbiteOptions}
        onChange={(v) => set({ soundbites: v })}
      />

      {/* Search */}
      {searchOpen ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search stories…"
            className="w-44 border-b border-gray-300 bg-transparent py-1 text-lg text-jw-ink focus:border-jw-blue focus:outline-none dark:border-gray-700 dark:text-gray-100"
          />
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              set({ search: '' });
              setSearchOpen(false);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 text-lg font-semibold text-gray-500 hover:text-jw-ink dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span>🔍</span> Search
        </button>
      )}

      {/* Right side: count + sort */}
      <div className="ml-auto flex items-center gap-5">
        <span className="text-lg text-gray-400 dark:text-gray-400">{count} stories</span>
        <button
          type="button"
          onClick={cycleSort}
          aria-label="Sort by duration"
          className={`flex items-center gap-1.5 text-lg font-semibold ${
            filters.sort
              ? 'text-jw-blue'
              : 'text-gray-500 hover:text-jw-ink dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <span>{sortArrow}</span> Duration
        </button>
      </div>
    </div>
  );
}
