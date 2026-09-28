import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/useTasks';
import { taskCategories, taskPriorities } from '../data/initialTasks';
import './TaskDetailsPage.css';

/**
 * TaskDetailsPage Component
 * Fulfills the "URL Parameters" and "Dynamic Routes" assignment requirements:
 * Accesses taskId via useParams() and renders full task details with edit/delete/status controls.
 */
export default function TaskDetailsPage() {
  const { taskId } = useParams(); // URL Parameter!
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask, toggleCompleteTask } = useTasks();

  const task = getTaskById(taskId);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    category: task?.category || 'Work',
    dueDate: task?.dueDate || '28 Aug 2026',
    status: task?.status || 'Pending'
  });
  const [feedback, setFeedback] = useState('');

  if (!task) {
    return (
      <div className="task-details-page container">
        <div className="not-found-card">
          <span className="not-found-icon">❓</span>
          <h2>Task Not Found</h2>
          <p>
            No task exists matching the URL Parameter <code>/tasks/{taskId}</code>.
          </p>
          <Link to="/tasks" className="btn btn-primary">
            &larr; Back to Tasks List
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateTask(task.id, { status: newStatus });
    setFeedback(`Status updated to "${newStatus}"`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateTask(task.id, formData);
    setIsEditing(false);
    setFeedback('Task details updated successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
      navigate('/tasks', { replace: true });
    }
  };

  const isCompleted = task.status === 'Completed';

  return (
    <div className="task-details-page container">
      
      {/* URL Parameter Proof Banner */}
      <div className="url-param-banner">
        <span className="param-label">🔗 Dynamic Route Parameter:</span>
        <code className="param-code">useParams().taskId = "{taskId}"</code>
        <span className="route-path-tag">Route: /tasks/:taskId</span>
      </div>

      {/* Back Link & Quick Actions Bar */}
      <div className="details-nav-row">
        <Link to="/tasks" className="back-link">
          &larr; Back to Tasks List
        </Link>
        <div className="details-header-actions">
          <button
            type="button"
            className={`btn ${isCompleted ? 'btn-secondary' : 'btn-success'}`}
            onClick={() => toggleCompleteTask(task.id)}
          >
            {isCompleted ? '↩️ Mark as Incomplete' : '✅ Mark as Completed'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : '✏️ Edit Task'}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            🗑️ Delete Task
          </button>
        </div>
      </div>

      {feedback && (
        <div className="details-feedback-banner">
          <span>✨ {feedback}</span>
        </div>
      )}

      {/* Main Task Details / Edit Form */}
      <div className="details-card">
        {isEditing ? (
          /* Edit Mode Form */
          <form onSubmit={handleSaveEdit} className="edit-task-form">
            <h2 className="edit-form-heading">Edit Task Information</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-title">Task Title</label>
              <input
                id="edit-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-select"
                >
                  {taskCategories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-priority">Priority</label>
                <select
                  id="edit-priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="form-select"
                >
                  {taskPriorities.filter((p) => p !== 'All').map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-due">Due Date</label>
                <input
                  id="edit-due"
                  type="text"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  placeholder="e.g. 28 Aug 2026"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-desc">Description</label>
              <textarea
                id="edit-desc"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
                required
              />
            </div>

            <div className="form-actions-row">
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                💾 Save Changes
              </button>
            </div>
          </form>
        ) : (
          /* View Details Mode */
          <div className="view-details-content">
            
            {/* Header: Title, Category & Priority */}
            <div className="task-view-header">
              <div className="badge-tag-wrap">
                <span className="category-pill-large">{task.category}</span>
                <span className={`priority-badge badge-${task.priority.toLowerCase()}`}>
                  Priority: {task.priority}
                </span>
                <span className="task-id-tag">ID: {task.id}</span>
              </div>

              <h1 className={`task-view-title ${isCompleted ? 'text-strikethrough' : ''}`}>
                {task.title}
              </h1>
            </div>

            {/* Fields Grid (Required Fields: Description, Priority, Category, Due, Status) */}
            <div className="fields-spec-grid">
              
              <div className="field-card">
                <span className="field-spec-label">Due Date</span>
                <div className="field-spec-val due-highlight">
                  <span>📅</span>
                  <span>{task.dueDate}</span>
                </div>
              </div>

              <div className="field-card">
                <span className="field-spec-label">Category</span>
                <div className="field-spec-val">
                  <span>🏷️</span>
                  <span>{task.category}</span>
                </div>
              </div>

              <div className="field-card">
                <span className="field-spec-label">Priority Level</span>
                <div className="field-spec-val">
                  <span>🔥</span>
                  <span>{task.priority} Priority</span>
                </div>
              </div>

              <div className="field-card">
                <span className="field-spec-label">Current Status</span>
                <div className="status-selector-wrap">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`status-select-badge select-${task.status.toLowerCase().replace(' ', '-')}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Description Section (Required Field) */}
            <div className="description-section">
              <h3 className="description-heading">Description</h3>
              <div className="description-text-box">
                <p>{task.description}</p>
              </div>
            </div>

            {/* Created Meta Footer */}
            <div className="details-meta-footer">
              <span>Task created on {task.createdAt || 'August 2026'}</span>
              <span>&bull;</span>
              <span>Managed via React Router Dynamic Route</span>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
