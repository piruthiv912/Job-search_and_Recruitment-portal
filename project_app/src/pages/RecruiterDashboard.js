import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI, jobAPI, companyAPI } from '../services/api';
import Modal from '../components/Modal';
import './Dashboard.css';

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusNotes, setStatusNotes] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState('');

    const fetchData = useCallback(async () => {
        try {
            if (!loading) setRefreshing(true);

            // Fetch company first
            try {
                const companyRes = await companyAPI.getMyCompany();
                setCompany(companyRes.data);
            } catch (err) {
                console.log("No company found for recruiter");
                setCompany(null);
            }

            // Fetch jobs posted by recruiter
            const jobsRes = await jobAPI.getRecruiterJobs();
            setJobs(jobsRes.data);

            // Fetch all applications for these jobs
            const appsRes = await applicationAPI.getApplications();
            setApplications(appsRes.data);

            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
            setRefreshing(false);
        }
    }, [loading]);

    useEffect(() => {
        fetchData();
        // Auto-refresh applications for recruiter too
        const interval = setInterval(fetchData, 20000);
        return () => clearInterval(interval);
    }, [fetchData]);


    const openStatusModal = (app) => {
        setSelectedApp(app);
        setUpdatingStatus(app.status);
        setStatusNotes(app.notes || '');
        setShowModal(true);
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        try {
            await applicationAPI.updateStatus(selectedApp._id, updatingStatus, statusNotes);
            // Refresh data
            const appsRes = await applicationAPI.getApplications();
            setApplications(appsRes.data);
            setShowModal(false);
            setSelectedApp(null);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return <div className="loading">Loading Recruitment Portal...</div>;

    return (
        <div className="dashboard-container recruiter-theme">
            <div className="dashboard-header">
                <div className="welcome-text">
                    <h1>Recruiter Portal</h1>
                    {company && <div className="badge accepted" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{company.name}</div>}
                    <p>Manage your job postings and reviewing applicants.</p>
                </div>
                <div className="dashboard-actions">
                    <button
                        className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
                        onClick={fetchData}
                        title="Sync Data"
                    >
                        🔄
                    </button>
                    {!company ? (
                        <Link to="/create-company" className="btn btn-primary pulse">Set Up Company Profile</Link>
                    ) : (
                        <Link to="/post-job" className="btn btn-primary">+ Post New Job</Link>
                    )}
                </div>
            </div>

            {!company && (
                <div className="alert-banner">
                    <span className="alert-banner-icon" aria-hidden="true">🏢</span>
                    <div className="alert-banner-copy">
                        <h3>Company Profile Required</h3>
                        <p>
                            You need to create a company profile before you can post jobs and receive applications.
                        </p>
                    </div>
                    <Link to="/create-company" className="btn btn-primary alert-banner-action">
                        Create Now
                    </Link>
                </div>
            )}


            <div className="dashboard-stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">💼</div>
                    <div className="stat-info">
                        <h3>{jobs.length}</h3>
                        <p>Active Jobs</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📄</div>
                    <div className="stat-info">
                        <h3>{applications.length}</h3>
                        <p>Total Applicants</p>
                    </div>
                </div>
                <div className="stat-card interview">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{applications.filter(a => a.status === 'Applied').length}</h3>
                        <p>Pending Review</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="main-section">
                    <div className="section-header">
                        <h2>Your Job Postings</h2>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="empty-state">
                            <p>You have not posted any jobs yet.</p>
                            {company && <Link to="/post-job" className="cta-button">Post a job</Link>}
                        </div>
                    ) : (
                    <div className="table-responsive">
                        <table className="applications-table">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Posted Date</th>
                                    <th>Applicants</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => {
                                    const appCount = applications.filter(a => a.job?._id === job._id).length;
                                    return (
                                        <tr key={job._id}>
                                            <td>{job.title}</td>
                                            <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                                            <td>
                                                <span className="applicant-count-badge">
                                                    {appCount}
                                                </span>
                                            </td>
                                            <td>{job.active ? 'Active' : 'Closed'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    )}

                    <div className="section-header" style={{ marginTop: '40px' }}>
                        <h2>Recent Applications</h2>
                    </div>

                    {applications.length === 0 ? (
                        <div className="empty-state">
                            <p>No applications yet. They will appear here as students apply.</p>
                        </div>
                    ) : (
                    <div className="table-responsive">
                        <table className="applications-table">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Job Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app._id}>
                                        <td>
                                            <div className="candidate-info">
                                                <strong>{app.student?.name}</strong>
                                                <br />
                                                <small>{app.student?.email}</small>
                                            </div>
                                        </td>
                                        <td>{app.job?.title}</td>
                                        <td>
                                            <span className={`status-badge ${app.status.toLowerCase()}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="view-btn"
                                                onClick={() => openStatusModal(app)}
                                            >
                                                Review & Update
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    )}
                </div>
            </div>
            {showModal && selectedApp && (
                <Modal title="Review Application" onClose={() => setShowModal(false)}>
                    <div className="candidate-summary">
                        <h3>{selectedApp.student?.name}</h3>
                        <p><strong>Email:</strong> {selectedApp.student?.email}</p>
                        <p><strong>Applying for:</strong> {selectedApp.job?.title}</p>
                    </div>

                    <div className="detail-group">
                        <label>Cover Letter</label>
                        <div className="cover-letter-box">
                            {selectedApp.coverletter || "No cover letter provided."}
                        </div>
                    </div>

                    {(selectedApp.resume || selectedApp.student?.resume || selectedApp.resumeName) && (
                        <div className="detail-group">
                            <label>Candidate Resume</label>
                            <div className="resume-box">
                                {selectedApp.resume || selectedApp.student?.resume ? (
                                    <a
                                        href={selectedApp.resume || selectedApp.student?.resume}
                                        download={selectedApp.resumeName || `${selectedApp.student?.name || 'Candidate'}_Resume.pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="resume-download-link"
                                    >
                                        📄 {selectedApp.resumeName || `Download ${selectedApp.student?.name || 'Candidate'}'s Resume`}
                                    </a>
                                ) : (
                                    <span>📄 {selectedApp.resumeName || 'Resume on file'}</span>
                                )}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleStatusUpdate} className="status-update-form">
                        <div className="detail-group">
                            <label>Actionable Status</label>
                            <select
                                className="form-control"
                                value={updatingStatus}
                                onChange={(e) => setUpdatingStatus(e.target.value)}
                            >
                                <option value="Applied">Keep as Applied</option>
                                <option value="Shortlisted">Shortlist Candidate</option>
                                <option value="Interview">Invite to Interview</option>
                                <option value="Rejected">Reject Application</option>
                                <option value="Accepted">Extend Offer (Accept)</option>
                            </select>
                        </div>

                        <div className="detail-group">
                            <label>Recruiter Feedback / Notes (Seen by student)</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Add comments or instructions for the student..."
                                value={statusNotes}
                                onChange={(e) => setStatusNotes(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary btn-block">
                                Update Application & Notify Student
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default RecruiterDashboard;

