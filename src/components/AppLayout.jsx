import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useTasks } from '../context/useTasks';
import JwtInspectorModal from './JwtInspectorModal';
import './AppLayout.css';

/**
 * AppLayout Component (Master Layout Route)
 * Provides global navigation bar, active link indicators, auth status, JWT inspector,
 * and renders nested routes via <Outlet />.
 */
export default function AppLayout() {
  const { isAuthenticated, user, logout, openJwtModal, rememberUser } = useAuth();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const pendingCount = tasks.filter((t) => t.status !== 'Completed').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="taskflow-app-layout">
      {/* Global Top Navbar */}
      <header className="taskflow-header">
        <div className="container header-container">
          
          {/* Logo & Brand */}
          <NavLink to="/" className="brand-logo-link">
            <span className="brand-icon">⚡</span>
            <div>
              <div className="brand-name-row">
                <span className="brand-name">TaskFlow</span>
                <span className="assignment-tag">Auth &amp; Routing</span>
              </div>
              <span className="brand-tagline">Assignment 6 &amp; 7 &bull; React Router + JWT Auth</span>
            </div>
          </NavLink>

          {/* Navigation Links using NavLink for active link styling */}
          <nav className="header-nav" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              title="Protected Dashboard: Requires Login"
            >
              <span>📊 Dashboard</span>
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>📋 Tasks</span>
              {pendingCount > 0 && <span className="nav-pill-badge">{pendingCount}</span>}
            </NavLink>

            <NavLink
              to="/add-task"
              className={({ isActive }) => `nav-link add-link ${isActive ? 'active' : ''}`}
              title="Protected Route: Requires authentication"
            >
              <span>➕ Add Task</span>
            </NavLink>

            <NavLink
              to="/completed"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>✅ Completed</span>
              {completedCount > 0 && <span className="nav-pill-completed">{completedCount}</span>}
            </NavLink>
          </nav>

          {/* Authentication Status & Controls */}
          <div className="header-auth-actions">
            {isAuthenticated ? (
              <div className="user-profile-badge">
                <div className="user-avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info-text">
                  <span className="user-name">{user?.name || user?.username || 'User'}</span>
                  <span className="user-status-online">
                    {rememberUser ? '💾 Saved (Local)' : '⚡ Session'}
                  </span>
                </div>

                {/* Live JWT Inspector Trigger Button */}
                <button
                  type="button"
                  className="jwt-active-badge-btn"
                  onClick={openJwtModal}
                  title="Inspect simulated JSON Web Token & claims"
                >
                  🔑 JWT
                </button>

                {/* Logout Button */}
                <button
                  type="button"
                  className="auth-btn logout-btn"
                  onClick={handleLogout}
                  title="Log out and invalidate session"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-secondary auth-login-btn">
                <span>🔒 Sign In</span>
              </NavLink>
            )}
          </div>

        </div>
      </header>

      {/* Main Outlet: Renders the active Nested Route page component */}
      <main className="main-content-outlet">
        <Outlet />
      </main>

      {/* Global JWT Modal */}
      <JwtInspectorModal />

      {/* Global Footer */}
      <footer className="taskflow-footer container">
        <div className="footer-row">
          <span>TaskFlow Manager &bull; Assignment 6 &amp; 7: React Router + Authentication System</span>
          <div className="footer-badges">
            <span className="footer-pill">Protected Dashboard</span>
            <span className="footer-pill">JWT Token Simulation</span>
            <span className="footer-pill">Remember User</span>
            <span className="footer-pill">Password Strength</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
