import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
    const { role, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
}
