import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎓 PlacementHub
        </Link>
        <div className="nav-menu">
          {token ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {user?.role === 'recruiter' && (
                <Link to="/post-job" className="nav-link post-job-btn">+ Post Job</Link>
              )}
              {user?.role === 'student' && (
                <Link to="/jobs" className="nav-link">Jobs</Link>
              )}
              <span className="user-info">{user?.name} ({user?.role})</span>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

