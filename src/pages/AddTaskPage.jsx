import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/useTasks';
import { taskCategories, taskPriorities } from '../data/initialTasks';
import './AddTaskPage.css';

/**
 * AddTaskPage Component (/add-task)
 * A Protected Route page that creates tasks with required fields:
 * Description, Priority, Category, Due Date, and Status.
 */
export default function AddTaskPage() {
  const navigate = useNavigate();
  const { addTask } = useTasks();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Work',
    dueDate: '28 Aug 2026',
    status: 'Pending'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.dueDate.trim()) errs.dueDate = 'Due date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addTask({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate.trim(),
      status: formData.status
    });

    // Navigate to tasks list
    navigate('/tasks');
  };

  return (
    <div className="add-task-page container">
      
      {/* Protected Route Banner */}
      <div className="protected-route-banner">
        <span>🛡️ <strong>Protected Route Active:</strong> You are authenticated to create tasks.</span>
      </div>

      <div className="add-task-card">
        <div className="form-header">
          <Link to="/tasks" className="back-link">
            &larr; Back to Tasks
          </Link>
          <h1 className="form-title">Create New Task</h1>
          <p className="form-subtitle">
            Define task objectives, category classification, priority level, and due date.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="task-creation-form" noValidate>
          
          {/* Task Title */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="req">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Prepare System Integration Deployment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`form-input ${errors.title ? 'input-error' : ''}`}
            />
            {errors.title && <span className="field-error">⚠️ {errors.title}</span>}
          </div>

          {/* 3-Column Meta Inputs */}
          <div className="form-row-3">
            
            {/* Category */}
            <div className="form-group">
              <label htmlFor="task-category" className="form-label">
                Category <span className="req">*</span>
              </label>
              <select
                id="task-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {taskCategories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="form-group">
              <label htmlFor="task-priority" className="form-label">
                Priority <span className="req">*</span>
              </label>
              <select
                id="task-priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="form-select"
              >
                {taskPriorities.filter((p) => p !== 'All').map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label htmlFor="task-due" className="form-label">
                Due Date <span className="req">*</span>
              </label>
              <input
                id="task-due"
                type="text"
                placeholder="e.g. 28 Aug 2026"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`form-input ${errors.dueDate ? 'input-error' : ''}`}
              />
              {errors.dueDate && <span className="field-error">⚠️ {errors.dueDate}</span>}
            </div>

          </div>

          {/* Initial Status */}
          <div className="form-group">
            <label className="form-label">Initial Status</label>
            <div className="radio-options-row">
              {['Pending', 'In Progress'].map((st) => (
                <label key={st} className={`radio-pill-label ${formData.status === st ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="status"
                    value={st}
                    checked={formData.status === st}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="hidden-radio"
                  />
                  <span>{st === 'Pending' ? '⏳ Pending' : '🔄 In Progress'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              Detailed Description <span className="req">*</span>
            </label>
            <textarea
              id="task-desc"
              rows="4"
              placeholder="Outline specific milestones, acceptance criteria, deliverables..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && <span className="field-error">⚠️ {errors.description}</span>}
          </div>

          {/* Actions */}
          <div className="form-footer-actions">
            <Link to="/tasks" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary submit-task-btn">
              <span>🚀 Create &amp; Save Task</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
