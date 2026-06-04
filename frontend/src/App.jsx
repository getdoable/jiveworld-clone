import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Stories from './pages/Stories.jsx';
import StoryDetail from './pages/StoryDetail.jsx';
import Collections from './pages/Collections.jsx';
import CollectionDetail from './pages/CollectionDetail.jsx';
import Progress from './pages/Progress.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* All /es-en/app/learn/* routes are guarded inside AppLayout. */}
      <Route path="/es-en/app/learn" element={<AppLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="stories" element={<Stories />} />
        <Route path="stories/:slug" element={<StoryDetail />} />
        <Route path="collections" element={<Collections />} />
        <Route path="collections/:slug" element={<CollectionDetail />} />
        <Route path="progress" element={<Progress />} />
      </Route>

      <Route path="/" element={<Navigate to="/es-en/app/learn/home" replace />} />
      <Route path="*" element={<Navigate to="/es-en/app/learn/home" replace />} />
    </Routes>
  );
}
