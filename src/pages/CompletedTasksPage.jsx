import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/useTasks';
import './CompletedTasksPage.css';

/**
 * CompletedTasksPage Component (/completed)
 * Dedicated view showcasing all finished tasks with reopen and clear options.
 */
export default function CompletedTasksPage() {
  const { tasks, toggleCompleteTask, deleteTask, clearCompleted } = useTasks();

  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  const handleClearAll = () => {
    if (window.confirm('Clear all completed tasks from history?')) {
      clearCompleted();
    }
  };

  return (
    <div className="completed-page container">
      
      {/* Header */}
      <div className="completed-header">
        <div>
          <h1 className="page-heading">Completed Milestones</h1>
          <p className="page-subheading">
            Review completed deliverables and archived tasks.
          </p>
        </div>

        {completedTasks.length > 0 && (
          <button
            type="button"
            className="btn btn-danger clear-btn"
            onClick={handleClearAll}
          >
            🗑️ Clear Completed ({completedTasks.length})
          </button>
        )}
      </div>

      {completedTasks.length === 0 ? (
        <div className="empty-completed-card">
          <span className="empty-icon">🏆</span>
          <h2>No Completed Tasks Yet</h2>
          <p>
            You have not marked any tasks as completed yet. Complete your first task from the task list!
          </p>
          <Link to="/tasks" className="btn btn-primary">
            📋 View Active Tasks
          </Link>
        </div>
      ) : (
        <div className="completed-grid">
          {completedTasks.map((t) => (
            <article key={t.id} className="completed-card">
              
              <div className="completed-card-top">
                <span className="completed-cat-badge">{t.category}</span>
                <span className={`priority-badge badge-${t.priority.toLowerCase()}`}>
                  {t.priority}
                </span>
              </div>

              <h3 className="completed-card-title">
                <Link to={`/tasks/${t.id}`} className="completed-title-link">
                  {t.title}
                </Link>
              </h3>

              <p className="completed-card-desc">{t.description}</p>

              <div className="completed-card-meta">
                <span>Completed on schedule</span>
                <span className="completed-date">Due was: {t.dueDate}</span>
              </div>

              <div className="completed-card-actions">
                <button
                  type="button"
                  className="reopen-btn"
                  onClick={() => toggleCompleteTask(t.id)}
                  title="Move back to pending tasks"
                >
                  ↩️ Reopen Task
                </button>

                <div className="card-right-actions">
                  <Link to={`/tasks/${t.id}`} className="details-link">
                    Details &rarr;
                  </Link>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteTask(t.id)}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>

            </article>
          ))}
        </div>
      )}

    </div>
  );
}
