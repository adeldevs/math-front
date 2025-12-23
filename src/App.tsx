
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { EventFormPage } from './pages/EventFormPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminEventEditPage from './pages/AdminEventEditPage';

function AdminRoutes({ isAdmin, onLogout }) {
  const location = useLocation();
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return (
    <Routes>
      <Route path="" element={<AdminEventsPage onLogout={onLogout} />} />
      <Route path="events/new" element={<EventFormPage />} />
      <Route path="events/edit/:id" element={<AdminEventEditPage />} />
    </Routes>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem('isAdmin'));
  const handleLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', '1');
  };
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/admin/login" element={<AdminLoginPage onLogin={handleLogin} />} />
        {/* Admin Protected Routes */}
        <Route path="/admin/*" element={<AdminRoutes isAdmin={isAdmin} onLogout={handleLogout} />} />
        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}