import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/useTasks';
import { useAuth } from '../context/useAuth';
import './DashboardPage.css';

/**
 * DashboardPage Component
 * Protected Dashboard (Assignment 7) with overview of metrics,
 * JWT status, priority distribution, deadlines, and recent tasks.
 */
export default function DashboardPage() {
  const { tasks, toggleCompleteTask } = useTasks();
  const { user, openJwtModal, rememberUser, storageType } = useAuth();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const highPriority = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Tasks due on or before 28 Aug 2026
  const upcomingDeadlines = tasks.filter(
    (t) => t.status !== 'Completed' && t.dueDate.includes('28 Aug 2026')
  );

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="dashboard-page container">
      
      {/* Welcome Banner */}
      <section className="dashboard-banner">
        <div>
          <div className="banner-auth-badge">
            <span className="auth-lock-icon">🔒</span>
            <span>Protected Dashboard &bull; Logged in as <strong>{user?.name || user?.username || 'Authenticated User'}</strong> ({user?.role || 'Lead'})</span>
          </div>
          <h1 className="banner-title">Welcome back, {user?.name || user?.username || 'Developer'}! 👋</h1>
          <p className="banner-desc">
            Organize workloads, track milestone deadlines, and manage authenticated sessions with simulated JWT tokens.
          </p>
          <div className="banner-session-chips">
            <span className="session-chip">
              💾 Storage: <strong>{storageType === 'localStorage' ? 'localStorage' : 'sessionStorage'}</strong>
            </span>
            <span className="session-chip">
              📌 Remember User: <strong>{rememberUser ? 'Enabled' : 'Disabled'}</strong>
            </span>
          </div>
        </div>
        <div className="banner-actions">
          <button type="button" className="btn btn-secondary" onClick={openJwtModal}>
            <span>🔑 Inspect Simulated JWT</span>
          </button>
          <Link to="/add-task" className="btn btn-primary">
            <span>➕ Create New Task</span>
          </Link>
          <Link to="/tasks" className="btn btn-outline">
            <span>📋 View All Tasks</span>
          </Link>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
            <span>📊</span>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Tasks</span>
            <span className="kpi-val">{total}</span>
            <span className="kpi-trend">All active &amp; archived</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <span>⏳</span>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Pending</span>
            <span className="kpi-val">{pending}</span>
            <span className="kpi-trend">Awaiting initiation</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <span>🔄</span>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">In Progress</span>
            <span className="kpi-val">{inProgress}</span>
            <span className="kpi-trend">Currently being worked on</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <span>✅</span>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Completed</span>
            <span className="kpi-val">{completed}</span>
            <span className="kpi-trend" style={{ color: '#34d399' }}>{completionRate}% success rate</span>
          </div>
        </div>
      </section>

      {/* Two Columns: Progress & Deadlines */}
      <section className="dashboard-mid-row">
        
        {/* Progress Breakdown Card */}
        <div className="dash-card">
          <h3 className="dash-card-title">📈 Overall Progress Completion</h3>
          <div className="progress-bar-wrap">
            <div className="progress-header">
              <span>Goal Completion</span>
              <span className="progress-percent">{completionRate}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>

          <div className="status-pills-breakdown">
            <div className="status-stat-pill">
              <span className="pill-dot dot-pending"></span>
              <span>Pending: <strong>{pending}</strong></span>
            </div>
            <div className="status-stat-pill">
              <span className="pill-dot dot-progress"></span>
              <span>In Progress: <strong>{inProgress}</strong></span>
            </div>
            <div className="status-stat-pill">
              <span className="pill-dot dot-completed"></span>
              <span>Completed: <strong>{completed}</strong></span>
            </div>
          </div>

          {highPriority > 0 && (
            <div className="high-priority-alert">
              ⚠️ You have <strong>{highPriority} high-priority</strong> tasks requiring immediate attention!
            </div>
          )}
        </div>

        {/* Due: 28 Aug 2026 Deadlines Focus Card */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3 className="dash-card-title">📅 Due: 28 Aug 2026 Focus</h3>
            <span className="badge-highlight">{upcomingDeadlines.length} Due</span>
          </div>
          <p className="card-sub-info">
            Tasks scheduled for completion on or around the primary target date:
          </p>

          <div className="deadlines-list">
            {upcomingDeadlines.length === 0 ? (
              <p className="no-items-text">No pending tasks due on 28 Aug 2026!</p>
            ) : (
              upcomingDeadlines.map((t) => (
                <div key={t.id} className="deadline-item-row">
                  <div className="deadline-text">
                    <Link to={`/tasks/${t.id}`} className="deadline-title-link">
                      {t.title}
                    </Link>
                    <span className="deadline-cat">Category: {t.category}</span>
                  </div>
                  <span className={`priority-badge badge-${t.priority.toLowerCase()}`}>
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

      {/* Recent Tasks Table with Dynamic Link to /tasks/:taskId */}
      <section className="recent-tasks-section">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">🕒 Recent Task Activities</h3>
            <span className="section-subtitle">Click any task to open its dynamic details route (/tasks/:taskId)</span>
          </div>
          <Link to="/tasks" className="view-all-link">
            Browse All Tasks ({total}) &rarr;
          </Link>
        </div>

        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Done</th>
                <th>Task Title &amp; Description</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((t) => {
                const isDone = t.status === 'Completed';

                return (
                  <tr key={t.id} className={`task-row ${isDone ? 'row-done' : ''}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleCompleteTask(t.id)}
                        className="task-checkbox"
                        aria-label={`Mark ${t.title} as completed`}
                      />
                    </td>
                    <td>
                      <Link to={`/tasks/${t.id}`} className="task-link-title">
                        {t.title}
                      </Link>
                      <p className="task-row-desc">{t.description}</p>
                    </td>
                    <td>
                      <span className="category-tag">{t.category}</span>
                    </td>
                    <td>
                      <span className={`priority-badge badge-${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className="due-date-text">📅 {t.dueDate}</span>
                    </td>
                    <td>
                      <span className={`status-pill pill-${t.status.toLowerCase().replace(' ', '-')}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to={`/tasks/${t.id}`} className="details-btn">
                        View Details &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
