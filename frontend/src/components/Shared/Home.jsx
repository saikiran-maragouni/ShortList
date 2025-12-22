import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user, loading } = useAuth();

    // Wait for auth state to load
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // Redirect logged-in users to their dashboards
    if (user?.role === 'RECRUITER') {
        return <Navigate to="/recruiter/jobs" replace />;
    }

    if (user?.role === 'CANDIDATE') {
        return <Navigate to="/candidate/jobs" replace />;
    }

    // Landing Page for Visitors
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">🚀 #1 AI-Powered Hiring Platform</div>
                    <h1 className="hero-title">
                        Find the Job That <br /> Fits Your Life
                    </h1>
                    <p className="hero-subtitle">
                        ShortList connects top talent with the best companies.
                        AI-powered matching to help you land your dream job faster.
                    </p>

                    {/* Mock Search Bar */}
                    <div className="hero-search-mock">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <span className="search-placeholder">Job title, skills, or company...</span>
                        </div>
                        <Link to="/register" className="search-btn">Search Jobs</Link>
                    </div>

                    <div className="hero-actions">
                        <span className="text-muted small">Popular: </span>
                        <span className="tag">Remote</span>
                        <span className="tag">Engineering</span>
                        <span className="tag">Product</span>
                        <span className="tag">Design</span>
                    </div>
                </div>

                {/* Floating Stats */}
                <div className="stats-banner">
                    <div className="stat-item">
                        <span className="stat-number">10k+</span>
                        <span className="stat-label">Active Jobs</span>
                    </div>
                    <div className="stat-item separator"></div>
                    <div className="stat-item">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Companies</span>
                    </div>
                    <div className="stat-item separator"></div>
                    <div className="stat-item">
                        <span className="stat-number">1M+</span>
                        <span className="stat-label">Candidates</span>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="trusted-section">
                <p>TRUSTED BY INNOVATIVE TEAMS AT</p>
                <div className="company-logos">
                    <span className="company-logo">Google</span>
                    <span className="company-logo">Microsoft</span>
                    <span className="company-logo">Spotify</span>
                    <span className="company-logo">Airbnb</span>
                    <span className="company-logo">Netflix</span>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header text-center">
                    <h2>Whose Team Are You On?</h2>
                    <p className="text-muted">Whether you're hiring or hunting, we've got the tools you need.</p>
                </div>

                <div className="features-grid">
                    {/* For Candidates */}
                    <div className="feature-card candidate">
                        <div className="card-icon-wrapper">👨‍💻</div>
                        <h3>I'm a Candidate</h3>
                        <p>Create a professional profile, get matched with jobs based on your actual skills, and track your applications in real-time.</p>
                        <ul className="feature-list">
                            <li>✨ AI Resume Scoring</li>
                            <li>🎯 Smart Job Matching</li>
                            <li>⚡ One-Click Apply</li>
                        </ul>
                        <Link to="/register" className="feature-link">Build Your CV &rarr;</Link>
                    </div>

                    {/* For Recruiters */}
                    <div className="feature-card recruiter">
                        <div className="card-icon-wrapper">🏢</div>
                        <h3>I'm a Recruiter</h3>
                        <p>Post jobs, manage applications, and use our AI scoring to find the perfect candidate in seconds, not days.</p>
                        <ul className="feature-list">
                            <li>🤖 Auto-Screening</li>
                            <li>📊 Candidate Ranking</li>
                            <li>💼 Company Branding</li>
                        </ul>
                        <Link to="/register" className="feature-link">Post a Job &rarr;</Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="steps-section">
                <div className="section-header">
                    <h2>How ShortList Works</h2>
                </div>
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-number">1</div>
                        <h4>Create Account</h4>
                        <p>Sign up as a candidate or recruiter in seconds.</p>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-item">
                        <div className="step-number">2</div>
                        <h4>Complete Profile</h4>
                        <p>Add your skills or company details to get noticed.</p>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <h4>Get Connected</h4>
                        <p>Apply to jobs or invite candidates instantly.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Journey?</h2>
                        <p>Join thousands of professionals and companies building the future together.</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="cta-btn primary">Join ShortList Today</Link>
                            <Link to="/login" className="cta-btn secondary">Log In</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>ShortList.</h3>
                        <p>Connecting talent with opportunity.</p>
                    </div>
                    <div className="footer-links">
                        <a href="#">About</a>
                        <a href="#">Careers</a>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ShortList. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
