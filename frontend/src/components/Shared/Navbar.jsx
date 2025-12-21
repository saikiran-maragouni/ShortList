import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isRecruiter, isCandidate } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    Shortlist
                </Link>

                <div className="nav-menu">
                    {user ? (
                        <>
                            <span className="nav-user">
                                {user.name} ({user.role})
                            </span>

                            {isRecruiter && (
                                <>
                                    <Link to="/recruiter/jobs" className="nav-link">
                                        My Jobs
                                    </Link>
                                    <Link to="/recruiter/jobs/new" className="nav-link">
                                        Post Job
                                    </Link>
                                </>
                            )}

                            {isCandidate && (
                                <>
                                    <Link to="/candidate/jobs" className="nav-link">
                                        Browse Jobs
                                    </Link>
                                    <Link to="/candidate/applications" className="nav-link">
                                        My Applications
                                    </Link>
                                </>
                            )}

                            <button onClick={logout} className="nav-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/register" className="nav-btn">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
