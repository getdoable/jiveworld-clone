import { getToken } from './auth.js';

// Fetches the user's study activity: { streak, activeDays: ['YYYY-MM-DD', ...] }.
export async function fetchActivity() {
  const res = await fetch('/api/activity', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to load activity');
  return res.json();
}
