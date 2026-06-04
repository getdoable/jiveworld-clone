import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { getUser, logout } from '../lib/auth.js';

const BASE = '/es-en/app/learn';

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
  const user = getUser();
  const path = location.pathname;

  const isHome = path.startsWith(`${BASE}/home`);
  const isStories =
    path.startsWith(`${BASE}/stories`) || path.startsWith(`${BASE}/collections`);
  const isStats = path.startsWith(`${BASE}/progress`);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-100 bg-white px-4 py-6">
      <div className="px-3">
        <Link to={`${BASE}/home`} aria-label="Jiveworld home">
          <Logo />
        </Link>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        <NavItem to={`${BASE}/home`} label="Home" icon="🏠" active={isHome} />
        <NavItem to={`${BASE}/stories`} label="Stories" icon="☰" active={isStories} />
        <NavItem to={`${BASE}/progress`} label="My stats" icon="★" active={isStats} />
      </nav>

      <div className="mt-auto border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-gray-700 hover:bg-gray-50"
          title="Log out"
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
