import React, { useState, useEffect, useCallback } from 'react';
import { applicationAPI, userAPI, companyAPI, activityAPI } from '../services/api';

import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { formatRelativeTime } from '../utils/time';
import './Dashboard.css';

const AdminDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusNotes, setStatusNotes] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState('');
    const [activities, setActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);
    const [activitiesError, setActivitiesError] = useState('');
    const { user: currentUser } = useAuth();

    const fetchData = useCallback(async () => {
        try {
            if (!loading) setRefreshing(true);

            const [appsRes, usersRes, companiesRes] = await Promise.all([
                applicationAPI.getApplications(),
                userAPI.getAllUsers(),
                companyAPI.getCompanies()
            ]);

            setApplications(appsRes.data);
            setUsers(usersRes.data);
            setCompanies(companiesRes.data);

            try {
                setActivitiesError('');
                const activitiesRes = await activityAPI.getActivities();
                setActivities(Array.isArray(activitiesRes.data) ? activitiesRes.data : []);
            } catch (activityError) {
                console.error("Error fetching activities:", activityError);
                setActivities([]);
                setActivitiesError(activityError.response?.data?.message || 'Could not load activity.');
            } finally {
                setActivitiesLoading(false);
            }

            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            setLoading(false);
            setRefreshing(false);
            setActivitiesLoading(false);
            setActivitiesError('Could not load activity.');
        }
    }, [loading]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [fetchData]);



    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await userAPI.deleteUser(id);
                fetchData();
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

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
            fetchData();
            setShowModal(false);
            setSelectedApp(null);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return <div className="loading">Global Command Center Initializing...</div>;

    return (
        <div className="dashboard-container admin-theme">
            <div className="dashboard-header glass">
                <div className="welcome-text">
                    <h1>Admin Command Center</h1>
                    <p>Global oversight of the entire placement ecosystem.</p>
                </div>
                <div className="dashboard-actions">
                    <button
                        className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
                        onClick={fetchData}
                        title="Sync Global Data"
                    >
                        🔄
                    </button>
                </div>
            </div>

            <div className="dashboard-stats-grid">
                <div className="stat-card glass">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>{users.length}</h3>
                        <p>System Users</p>
                    </div>
                </div>
                <div className="stat-card shortlisted glass">
                    <div className="stat-icon">🎓</div>
                    <div className="stat-info">
                        <h3>{applications.length}</h3>
                        <p>Applications</p>
                    </div>
                </div>
                <div className="stat-card interview glass">
                    <div className="stat-icon">🏢</div>
                    <div className="stat-info">
                        <h3>{companies.length}</h3>
                        <p>Registered Companies</p>
                    </div>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>Applications</button>
                <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
                <button className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>Companies</button>
            </div>

            <div className="dashboard-content">
                <div className="main-section glass">
                    {activeTab === 'overview' && (
                        <div className="overview-section">
                            <div className="section-header">
                                <h2>System Snapshot</h2>
                            </div>
                            <div className="snapshot-grid">
                                <div className="snapshot-item">
                                    <h4>Students</h4>
                                    <p className="snapshot-value snapshot-primary">
                                        {users.filter(u => u.role === 'student').length}
                                    </p>
                                </div>
                                <div className="snapshot-item">
                                    <h4>Recruiters</h4>
                                    <p className="snapshot-value snapshot-accent">
                                        {users.filter(u => u.role === 'recruiter').length}
                                    </p>
                                </div>
                                <div className="snapshot-item">
                                    <h4>Placements</h4>
                                    <p className="snapshot-value snapshot-success">
                                        {applications.filter(a => a.status === 'Accepted').length}
                                    </p>
                                </div>
                            </div>
                            <div className="section-header activity-header">
                                <h2>Recent Global Activity</h2>
                            </div>
                            <div className="activity-list">
                                {activitiesLoading && (
                                    <div className="empty-state compact">Loading activity…</div>
                                )}
                                {!activitiesLoading && activitiesError && (
                                    <div className="empty-state compact error-state">
                                        <p>{activitiesError}</p>
                                        <button type="button" className="view-btn" onClick={fetchData}>Try again</button>
                                    </div>
                                )}
                                {!activitiesLoading && !activitiesError && activities.length === 0 && (
                                    <div className="empty-state compact">
                                        <p>No activity yet. New signups, jobs, and application updates will appear here.</p>
                                    </div>
                                )}
                                {!activitiesLoading && !activitiesError && activities.map(activity => (
                                    <div key={activity._id} className="activity-item">
                                        <div className="activity-copy">
                                            <p>{activity.message}</p>
                                            <span className="activity-time">{formatRelativeTime(activity.createdAt)}</span>
                                        </div>
                                        <span className={`activity-type ${activity.type.replace(/\./g, '-').replace(/_/g, '-')}`}>
                                            {activity.type.replace(/\./g, ' ').replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'applications' && (
                        <>
                            <div className="section-header">
                                <h2>System-Wide Applications</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="applications-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Company & Role</th>
                                            <th>Status</th>
                                            <th>Manage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="table-empty">No applications in the system yet.</td>
                                            </tr>
                                        )}
                                        {applications.map(app => (
                                            <tr key={app._id}>
                                                <td>
                                                    <strong>{app.student?.name}</strong><br />
                                                    <small>{app.student?.email}</small>
                                                </td>
                                                <td>
                                                    <strong>{app.job?.company?.name}</strong><br />
                                                    {app.job?.title}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="view-btn" onClick={() => openStatusModal(app)}>
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'users' && (
                        <>
                            <div className="section-header">
                                <h2>User Directory</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="applications-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="table-empty">No users found.</td>
                                            </tr>
                                        )}
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td><strong>{u.name}</strong></td>
                                                <td>{u.email}</td>
                                                <td><span className={`status-badge ${u.role}`}>{u.role}</span></td>
                                                <td>
                                                    {u._id !== currentUser?._id && (
                                                        <button className="view-btn danger" style={{ background: 'var(--danger)' }} onClick={() => handleDeleteUser(u._id)}>Delete</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'companies' && (
                        <>
                            <div className="section-header">
                                <h2>Partner Companies</h2>
                            </div>
                            <div className="table-responsive">
                                <table className="applications-table">
                                    <thead>
                                        <tr>
                                            <th>Company Name</th>
                                            <th>Industry</th>
                                            <th>Location</th>
                                            <th>Website</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companies.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="table-empty">No companies registered yet.</td>
                                            </tr>
                                        )}
                                        {companies.map(c => (
                                            <tr key={c._id}>
                                                <td><strong>{c.name}</strong></td>
                                                <td>{c.industry || 'N/A'}</td>
                                                <td>{c.location || 'N/A'}</td>
                                                <td>
                                                    {c.website ? (
                                                        <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer">
                                                            Visit Website
                                                        </a>
                                                    ) : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showModal && selectedApp && (
                <Modal title="Admin System Review" onClose={() => setShowModal(false)}>
                    <div className="candidate-summary">
                        <p><strong>Candidate:</strong> {selectedApp.student?.name}</p>
                        <p><strong>Applying for:</strong> {selectedApp.job?.title} at {selectedApp.job?.company?.name}</p>
                    </div>

                    <form onSubmit={handleStatusUpdate}>
                        <div className="detail-group">
                            <label>System-Wide Override Status</label>
                            <select
                                className="form-control"
                                value={updatingStatus}
                                onChange={(e) => setUpdatingStatus(e.target.value)}
                            >
                                <option value="Applied">Applied</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview">Interview</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Accepted">Accepted</option>
                            </select>
                        </div>
                        <div className="detail-group">
                            <label>Admin System Feedback</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Enter official placement records notes..."
                                value={statusNotes}
                                onChange={(e) => setStatusNotes(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">
                            Save System Changes
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default AdminDashboard;
