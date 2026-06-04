import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { isAuthenticated } from '../lib/auth.js';

// Authenticated shell: sidebar + routed content.
// Any /es-en/app/* route that renders inside this layout is guarded — a missing
// token redirects to /login.
export default function AppLayout() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
