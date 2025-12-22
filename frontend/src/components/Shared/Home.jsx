import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user, isRecruiter } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/candidate/jobs?search=${searchQuery}&location=${locationQuery}`);
    };

    const categories = [
        { name: 'Engineering', icon: '💻', jobs: '1.2k+' },
        { name: 'Design', icon: '🎨', jobs: '800+' },
        { name: 'Marketing', icon: '📢', jobs: '500+' },
        { name: 'Finance', icon: '💰', jobs: '300+' },
        { name: 'Support', icon: '🎧', jobs: '1.5k+' },
        { name: 'Health', icon: '🩺', jobs: '600+' }
    ];

    return (
        <div className="home-wrapper">
            {/* Animated Hero Section */}
            <section className="hero-container">
                <div className="hero-bg-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>

                <div className="hero-content-wrapper">
                    <div className="hero-text opacity-0 animate-slide-up">
                        <div className="badge-pill">
                            <span className="badge-icon">✨</span>
                            The #1 Platform for Top Talent
                        </div>
                        <h1 className="hero-heading">
                            Find Your <span className="gradient-text">Dream Job</span> <br />
                            Without The Hassle.
                        </h1>
                        <p className="hero-subheading">
                            Connect with 500+ top companies and startups.
                            AI-powered matching to fast-track your career.
                        </p>

                        <form onSubmit={handleSearch} className="search-box-floating">
                            <div className="search-field">
                                <i className="icon-search">🔍</i>
                                <input
                                    type="text"
                                    placeholder="Job title, skills, or company..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="search-divider"></div>
                            <div className="search-field">
                                <i className="icon-location">📍</i>
                                <input
                                    type="text"
                                    placeholder="City or 'Remote'"
                                    value={locationQuery}
                                    onChange={(e) => setLocationQuery(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="search-btn-primary">
                                Find Jobs
                            </button>
                        </form>

                        <div className="hero-tags">
                            <span>Trending:</span>
                            <span className="tag" onClick={() => navigate('/candidate/jobs?search=Remote')}>Remote</span>
                            <span className="tag" onClick={() => navigate('/candidate/jobs?search=AI')}>AI</span>
                            <span className="tag" onClick={() => navigate('/candidate/jobs?search=Design')}>Design</span>
                        </div>
                    </div>

                    <div className="hero-visual opacity-0 animate-fade-in delay-200">
                        <div className="avatar-wrapper floating-animation">
                            <img src="/hero-avatar.png" alt="Happy Professional" className="hero-img" />

                            {/* Floating Cards */}
                            <div className="status-card card-matched">
                                <div className="status-icon">✅</div>
                                <div className="status-info">
                                    <strong>Matched</strong>
                                    <span>Senior Developer</span>
                                </div>
                            </div>

                            <div className="status-card card-offer">
                                <div className="status-icon">🎉</div>
                                <div className="status-info">
                                    <strong>Offer Recieved</strong>
                                    <span>$120k / Year</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="stats-bar">
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-num">10k+</span>
                        <span className="stat-desc">Active Jobs</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-num">500+</span>
                        <span className="stat-desc">Companies</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-num">1M+</span>
                        <span className="stat-desc">Candidates</span>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section-block bg-white">
                <div className="section-header">
                    <h2>Explore Categories</h2>
                    <p>Discover opportunities across various sectors.</p>
                </div>
                <div className="categories-box-grid">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="cat-box" onClick={() => navigate(`/candidate/jobs?search=${cat.name}`)}>
                            <div className="cat-box-icon">{cat.icon}</div>
                            <h3>{cat.name}</h3>
                            <span className="job-count">{cat.jobs} Openings</span>
                            <span className="hover-arrow">→</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="section-block bg-light">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Simple steps to your next big career move.</p>
                </div>
                <div className="process-steps">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Create Profile</h3>
                        <p>Sign up and build your professional profile in minutes.</p>
                    </div>
                    <div className="step-line"></div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Get Matched</h3>
                        <p>Our AI finds the best jobs that fit your skills and preferences.</p>
                    </div>
                    <div className="step-line"></div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>Apply & Hire</h3>
                        <p>Apply with one click and get hired by top companies.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-banner">
                <div className="cta-inner">
                    <h2>Ready to Shape Your Future?</h2>
                    <p>Join the community of 1M+ professionals today.</p>
                    <div className="cta-group">
                        {!user ? (
                            <>
                                <Link to="/register" className="btn-solid-white">Get Started Free</Link>
                                <Link to="/login" className="btn-outline-white">Login</Link>
                            </>
                        ) : (
                            <Link to={isRecruiter ? "/recruiter/jobs" : "/candidate/jobs"} className="btn-solid-white">
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-modern">
                <div className="footer-main">
                    <div className="footer-brand">
                        <h3>ShortList<span className="dot">.</span></h3>
                        <p>Making hiring human again.</p>
                    </div>
                    <div className="footer-nav">
                        <Link to="/jobs">Jobs</Link>
                        <Link to="/companies">Companies</Link>
                        <Link to="/blog">Blog</Link>
                        <Link to="/support">Support</Link>
                    </div>
                </div>
                <div className="footer-copy">
                    © 2024 ShortList Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
