import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import PageMarker from '../components/PageMarker.jsx';
import { saveSession, isAuthenticated } from '../lib/auth.js';

const HOME = '/es-en/app/learn/home';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, go straight to the app.
  if (isAuthenticated()) {
    navigate(HOME, { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError('Invalid email or password.');
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      saveSession(data.token, data.user);
      navigate(HOME, { replace: true });
    } catch {
      setError('Could not reach the server. Is the backend running on :3001?');
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <PageMarker state="login" />
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold text-jw-ink dark:text-gray-100">Log in</h1>
        <p className="mt-1 text-center text-sm text-gray-500 dark:text-gray-400">
          Welcome back to Jiveworld Español
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="username"
              name="username"
              type="email"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 outline-none focus:border-jw-blue"
              placeholder="testuser@jiveworld.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 outline-none focus:border-jw-blue"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-jw-blue py-2.5 font-semibold text-white transition hover:bg-[#2f93bd] disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-400">
          Demo credentials: testuser@jiveworld.com / password123
        </p>
      </div>
    </div>
  );
}
