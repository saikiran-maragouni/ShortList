import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        const redirectPath = user.role === 'RECRUITER' ? '/recruiter/jobs' : '/candidate/jobs';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
