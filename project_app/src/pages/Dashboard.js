import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import './Dashboard.css';

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const { user } = useAuth();

  const fetchApplications = useCallback(async () => {
    try {
      if (!loading) setRefreshing(true);
      const response = await applicationAPI.getApplications();
      setApplications(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchApplications();

    // Auto-refresh every 15 seconds to simulate real-time updates
    const interval = setInterval(fetchApplications, 15000);
    return () => clearInterval(interval);
  }, [fetchApplications]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-text">
          <h1>Welcome back, <span className="highlight">{user?.username || user?.name}</span>!</h1>
          <p>Here's what's happening with your job search today.</p>
        </div>
        <button
          className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
          onClick={fetchApplications}
          title="Refresh Data"
        >
          🔄
        </button>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{applications.length}</h3>
            <p>Total Applied</p>
          </div>
        </div>
        <div className="stat-card shortlisted">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{applications.filter(a => a.status === 'Shortlisted').length}</h3>
            <p>Shortlisted</p>
          </div>
        </div>
        <div className="stat-card interview">
          <div className="stat-icon">🗓️</div>
          <div className="stat-info">
            <h3>{applications.filter(a => a.status === 'Interview').length}</h3>
            <p>Interviews</p>
          </div>
        </div>
        <div className="stat-card offer">
          <div className="stat-icon">🎉</div>
          <div className="stat-info">
            <h3>{applications.filter(a => a.status === 'Accepted').length}</h3>
            <p>Offers</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-section">
          <div className="section-header">
            <h2>Track Applications</h2>
            <Link to="/jobs" className="browse-link">Browse More Jobs →</Link>
          </div>

          {applications.length === 0 ? (
            <div className="no-data-card">
              <p>You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="cta-button">Start Applying</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Feedback</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app._id}>
                      <td className="company-cell">
                        <div className="company-logo-placeholder">{app.job?.company?.name?.charAt(0) || '?'}</div>
                        <span>{app.job?.company?.name}</span>
                      </td>
                      <td className="role-cell">
                        {app.job?.title}
                      </td>
                      <td>
                        <span className={`status-badge ${app.status?.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="feedback-cell-preview">
                        {app.notes ? (
                          <span className="notes-preview">{app.notes.substring(0, 30)}...</span>
                        ) : (
                          <span className="no-notes">No feedback yet</span>
                        )}
                      </td>
                      <td>
                        <button className="view-btn" onClick={() => setSelectedApp(app)}>View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <h2>Application Updates</h2>
          </div>
          <div className="notification-list">
            {applications.filter(a => a.status !== 'Applied').slice(0, 5).map(app => (
              <div key={app._id} className="notification-item" onClick={() => setSelectedApp(app)}>
                <div className="notification-icon">🔔</div>
                <div className="notification-content">
                  <p><strong>{app.job?.company?.name}</strong> updated your status to <span className={`status-text ${app.status.toLowerCase()}`}>{app.status}</span></p>
                  {app.notes && <p className="notification-note">"{app.notes.substring(0, 50)}..."</p>}
                </div>
              </div>
            ))}
            {applications.filter(a => a.status !== 'Applied').length === 0 && (
              <p className="no-data-msg">No updates yet. Check back later!</p>
            )}
          </div>
        </div>
      </div>

      {selectedApp && (
        <Modal title="Application Details" onClose={() => setSelectedApp(null)}>
          <div className="detail-group">
            <label>Job Role</label>
            <p>{selectedApp.job?.title} @ {selectedApp.job?.company?.name}</p>
          </div>

          <div className="detail-group">
            <label>Status</label>
            <span className={`status-badge ${selectedApp.status.toLowerCase()}`}>
              {selectedApp.status}
            </span>
          </div>

          <div className="detail-group">
            <label>Your Cover Letter</label>
            <div className="cover-letter-box">
              {selectedApp.coverletter || "No cover letter submitted."}
            </div>
          </div>

          {(selectedApp.resume || selectedApp.resumeName) && (
            <div className="detail-group">
              <label>Attached Resume</label>
              <div className="resume-box">
                {selectedApp.resume ? (
                  <a
                    href={selectedApp.resume}
                    download={selectedApp.resumeName || "Resume.pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-download-link"
                  >
                    📄 {selectedApp.resumeName || "Download Resume"}
                  </a>
                ) : (
                  <span>📄 {selectedApp.resumeName}</span>
                )}
              </div>
            </div>
          )}

          {selectedApp.notes && (
            <div className="detail-group">
              <label>Recruiter Notes</label>
              <p className="notes-text">{selectedApp.notes}</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default StudentDashboard;

