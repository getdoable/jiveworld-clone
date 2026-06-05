// Client-side settings, persisted to localStorage. The theme is applied to the
// document so the whole app re-skins; the other values are stored preferences.

const KEY = 'jw_settings';

export const DEFAULT_SETTINGS = {
  theme: 'light', // 'light' | 'dark' | 'system'
  soundEffects: true,
  downloadStories: true,
  vocabExport: false,
  // Player tab
  xrayMode: 'showAll', // 'showAll' | 'hideSome' | 'hideAll'
  smartPause: false,
  compactToolbar: false,
};

export function getSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

// Persists a partial update, re-applies the theme, and broadcasts a
// `settings-updated` event so open UI can react live.
export function updateSettings(partial) {
  const next = { ...getSettings(), ...partial };
  localStorage.setItem(KEY, JSON.stringify(next));
  applyTheme(next.theme);
  window.dispatchEvent(new CustomEvent('settings-updated', { detail: next }));
  return next;
}

// True when the OS currently prefers a dark color scheme.
function prefersDark() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

// Adds/removes the `dark` class on <html> based on the chosen theme.
export function applyTheme(theme = getSettings().theme) {
  const dark = theme === 'dark' || (theme === 'system' && prefersDark());
  document.documentElement.classList.toggle('dark', dark);
}

// Call once at startup. Applies the saved theme and, while "system" is active,
// keeps the app in sync with OS theme changes.
export function initTheme() {
  applyTheme();
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getSettings().theme === 'system') applyTheme('system');
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
}
