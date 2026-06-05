import { getToken } from './auth.js';

// Shared request helper: attaches the Bearer token and surfaces the server's
// error message (when present) as a thrown Error.
async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    throw new Error((body && body.error) || 'Request failed');
  }
  return body;
}

// Fetches the user's study activity: { streak, activeDays: ['YYYY-MM-DD', ...] }.
export async function fetchActivity() {
  return request('/api/activity');
}

// Fetches the account: { name, email, membership }.
export async function fetchAccount() {
  return request('/api/account');
}

// Updates name and/or email. Returns the updated account.
export async function updateAccount(patch) {
  return request('/api/account', { method: 'PATCH', body: JSON.stringify(patch) });
}

// Changes the password (verifies the current one server-side).
export async function changePassword(currentPassword, newPassword) {
  return request('/api/account/password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// Updates the (fake) payment method. Returns the updated membership.
export async function updatePayment(payment) {
  return request('/api/account/payment', { method: 'PUT', body: JSON.stringify(payment) });
}

// Cancels the subscription. Returns the updated membership.
export async function cancelSubscription() {
  return request('/api/account/cancel', { method: 'POST' });
}

// Reactivates a canceled subscription. Returns the updated membership.
export async function resubscribe() {
  return request('/api/account/resubscribe', { method: 'POST' });
}
