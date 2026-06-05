// Tiny localStorage-backed session helper.
const TOKEN_KEY = 'jw_token';
const USER_KEY = 'jw_user';

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user || { name: 'Test User' }));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || { name: 'Test User' };
  } catch {
    return { name: 'Test User' };
  }
}

// Merges fields into the stored user and broadcasts a `user-updated` event so
// live UI (e.g. the sidebar + greeting) can react without a full reload.
export function updateStoredUser(partial) {
  const next = { ...getUser(), ...partial };
  localStorage.setItem(USER_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('user-updated', { detail: next }));
  return next;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
