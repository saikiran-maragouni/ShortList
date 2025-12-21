import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const { user, loading } = useAuth();

    // Wait for auth state to load
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // Not authenticated - redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect based on role
    if (user.role === 'RECRUITER') {
        return <Navigate to="/recruiter/jobs" replace />;
    }

    if (user.role === 'CANDIDATE') {
        return <Navigate to="/candidate/jobs" replace />;
    }

    // Fallback (shouldn't happen with proper role validation)
    return <Navigate to="/login" replace />;
};

export default Home;
