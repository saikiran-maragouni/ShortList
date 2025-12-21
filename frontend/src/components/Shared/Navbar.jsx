import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isRecruiter, isCandidate } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    ShortList<span className="logo-dot">.</span>
                </Link>

                <div className="nav-menu">
                    {user ? (
                        <>
                            <div className="nav-links">
                                {isRecruiter && (
                                    <>
                                        <Link to="/recruiter/jobs" className={`nav-link ${isActive('/recruiter/jobs')}`}>
                                            Dashboard
                                        </Link>
                                        <Link to="/recruiter/jobs/new" className={`nav-link ${isActive('/recruiter/jobs/new')}`}>
                                            Post Job
                                        </Link>
                                        <Link to="/recruiter/profile" className={`nav-link ${isActive('/recruiter/profile')}`}>
                                            Company
                                        </Link>
                                    </>
                                )}

                                {isCandidate && (
                                    <>
                                        <Link to="/candidate/jobs" className={`nav-link ${isActive('/candidate/jobs')}`}>
                                            Find Jobs
                                        </Link>
                                        <Link to="/candidate/applications" className={`nav-link ${isActive('/candidate/applications')}`}>
                                            My Applications
                                        </Link>
                                    </>
                                )}
                            </div>

                            <div className="nav-user-controls">
                                <ThemeToggle />
                                {isCandidate && (
                                    <Link to="/candidate/profile" className="user-profile-link">
                                        <div className="avatar-circle">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </Link>
                                )}
                                <div className="user-info">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-role">{isRecruiter ? 'Recruiter' : 'Candidate'}</span>
                                </div>
                                <button onClick={logout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <ThemeToggle />
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
