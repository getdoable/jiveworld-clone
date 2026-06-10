import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Stories from './pages/Stories.jsx';
import StoryDetail from './pages/StoryDetail.jsx';
import Collections from './pages/Collections.jsx';
import CollectionDetail from './pages/CollectionDetail.jsx';
import Progress from './pages/Progress.jsx';
import Account from './pages/Account.jsx';
import Support from './pages/Support.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Story detail is a full-screen takeover (no sidebar); it guards auth itself. */}
      <Route path="/es-en/app/learn/stories/:slug" element={<StoryDetail />} />

      {/* Account is a full-screen page (no sidebar); it guards auth itself. */}
      <Route path="/es-en/app/learn/account" element={<Account />} />

      {/* All other /es-en/app/learn/* routes are guarded inside AppLayout. */}
      <Route path="/es-en/app/learn" element={<AppLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="stories" element={<Stories />} />
        <Route path="stories/study-later" element={<Stories />} />
        <Route path="stories/in-progress" element={<Stories />} />
        <Route path="stories/completed" element={<Stories />} />
        <Route path="stories/unplayed" element={<Stories />} />
        <Route path="collections" element={<Collections />} />
        <Route path="collections/:slug" element={<CollectionDetail />} />
        <Route path="progress" element={<Progress />} />
        <Route path="support" element={<Support />} />
      </Route>

      <Route path="/" element={<Navigate to="/es-en/app/learn/home" replace />} />
      <Route path="*" element={<Navigate to="/es-en/app/learn/home" replace />} />
    </Routes>
  );
}
