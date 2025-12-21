import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Shared/Navbar';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Shared/Home';
import CandidateJobs from './components/Candidate/JobList';
import CandidateApplications from './components/Candidate/MyApplications';
import CandidateProfile from './components/Candidate/CandidateProfile';
import RecruiterJobs from './components/Recruiter/MyJobs';
import RecruiterJobForm from './components/Recruiter/JobForm';
import RecruiterApplications from './components/Recruiter/Applications';
import CompanyProfile from './components/Recruiter/CompanyProfile';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Candidate routes */}
                            <Route
                                path="/candidate/jobs"
                                element={
                                    <ProtectedRoute requiredRole="CANDIDATE">
                                        <CandidateJobs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/candidate/applications"
                                element={
                                    <ProtectedRoute requiredRole="CANDIDATE">
                                        <CandidateApplications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/candidate/profile"
                                element={
                                    <ProtectedRoute requiredRole="CANDIDATE">
                                        <CandidateProfile />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Recruiter routes */}
                            <Route
                                path="/recruiter/jobs"
                                element={
                                    <ProtectedRoute requiredRole="RECRUITER">
                                        <RecruiterJobs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/recruiter/jobs/new"
                                element={
                                    <ProtectedRoute requiredRole="RECRUITER">
                                        <RecruiterJobForm />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/recruiter/jobs/:id/edit"
                                element={
                                    <ProtectedRoute requiredRole="RECRUITER">
                                        <RecruiterJobForm />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/recruiter/applications/:jobId"
                                element={
                                    <ProtectedRoute requiredRole="RECRUITER">
                                        <RecruiterApplications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/recruiter/profile"
                                element={
                                    <ProtectedRoute requiredRole="RECRUITER">
                                        <CompanyProfile />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Catch all */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
