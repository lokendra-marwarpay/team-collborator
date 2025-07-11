import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import TeamPage from './pages/Team.tsx';
import TeamDetails from './pages/TeamDetails';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectDetails from './pages/ProjectDetails.tsx';
import Navbar from './components/Navbar.tsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      <Navbar />
      <Routes>
        {!user ? (
          <Route path="*" element={<AuthPage />} />
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/teams/:id" element={<TeamDetails />} />


            <Route path="/projects/:id" element={<ProjectDetails />} />

            <Route
              path="/team"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <TeamPage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
