// Per-story listening progress, persisted to localStorage. We only track how
// many chapters have been listened to; every other number on the story page is
// derived deterministically from the story data + this count.

const KEY = 'jw_story_progress';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

// Chapters listened for a story — falls back to the story's seeded count when
// the user hasn't reset/relistened yet.
export function getChaptersDone(slug, fallback) {
  const all = readAll();
  const entry = all[slug];
  return entry && typeof entry.chaptersDone === 'number' ? entry.chaptersDone : fallback;
}

export function setChaptersDone(slug, n) {
  const all = readAll();
  all[slug] = { ...(all[slug] || {}), chaptersDone: n };
  localStorage.setItem(KEY, JSON.stringify(all));
  return n;
}
