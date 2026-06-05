import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import AboutModal from './AboutModal.jsx';
import { getUser, logout } from '../lib/auth.js';

const BASE = '/es-en/app/learn';

// Account menu rows (icons mirror the Jiveworld account popup).
const ACCOUNT_ITEMS = [
  { key: 'account', label: 'Manage my account', icon: '👤' },
  { key: 'settings', label: 'Settings', icon: '🎚️' },
  { key: 'redeem', label: 'Redeem a code', icon: '🏷️' },
  { key: 'support', label: 'Support and feedback', icon: '🛟' },
  { key: 'share', label: 'Share Jiveworld', icon: '🔗' },
  { key: 'reload', label: 'Reload', icon: '🔄' },
  { key: 'signout', label: 'Sign out', icon: '⏏️' },
];

function NavItem({ to, label, icon, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-lg font-semibold transition-colors ${
        active ? 'text-jw-blue' : 'text-gray-700 hover:text-jw-blue'
      }`}
    >
      <span className="w-6 text-center" aria-hidden="true">
        {icon}
      </span>
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getUser);
  const menuRef = useRef(null);

  // Keep the name/email in sync when the account page edits them.
  useEffect(() => {
    function onUserUpdated(e) {
      setUser(e.detail || getUser());
    }
    window.addEventListener('user-updated', onUserUpdated);
    return () => window.removeEventListener('user-updated', onUserUpdated);
  }, []);

  const isHome = path.startsWith(`${BASE}/home`);
  const isStories =
    path.startsWith(`${BASE}/stories`) || path.startsWith(`${BASE}/collections`);
  const isStats = path.startsWith(`${BASE}/progress`);

  // Close the account menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleAccountItem(key) {
    setMenuOpen(false);
    if (key === 'signout') handleLogout();
    else if (key === 'reload') window.location.reload();
    else if (key === 'account') navigate(`${BASE}/account`);
    // settings / redeem / support / share have no destination yet.
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-100 bg-white px-4 py-6">
      <div className="px-3">
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          aria-label="About Jiveworld Español"
        >
          <Logo />
        </button>
      </div>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <nav className="mt-8 flex flex-col gap-1">
        <NavItem to={`${BASE}/home`} label="Home" icon="🏠" active={isHome} />
        <NavItem to={`${BASE}/stories`} label="Stories" icon="☰" active={isStories} />
        <NavItem to={`${BASE}/progress`} label="My stats" icon="★" active={isStats} />
      </nav>

      <div className="relative mt-auto border-t border-gray-100 pt-4" ref={menuRef}>
        {menuOpen && (
          <div
            role="menu"
            className="animate-modal-pop absolute bottom-full left-0 z-40 mb-3 w-72 overflow-hidden rounded-2xl bg-white py-2 shadow-xl ring-1 ring-black/5"
          >
            <div className="border-b border-gray-100 px-5 pb-3 pt-2">
              <div className="text-xl font-bold text-jw-ink">{user.name}</div>
              <div className="truncate text-sm text-gray-500">{user.email}</div>
            </div>
            {ACCOUNT_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                onClick={() => handleAccountItem(item.key)}
                className="flex w-full items-center gap-3 border-b border-gray-100 px-5 py-3 text-left text-lg text-gray-700 last:border-0 hover:bg-gray-50"
              >
                <span className="w-6 text-center text-lg text-gray-400" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-50 ${
            menuOpen ? 'bg-gray-50' : ''
          }`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          title="Account"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gray-200 text-gray-600">
            ◔
          </span>
          <span className="font-medium">{user.name}</span>
        </button>
      </div>
    </aside>
  );
}
