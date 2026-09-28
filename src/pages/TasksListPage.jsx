import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/useTasks';
import { taskCategories, taskPriorities, taskStatuses } from '../data/initialTasks';
import './TasksListPage.css';

/**
 * TasksListPage Component (/tasks)
 * Displays list of tasks with multi-factor filtering, search, sorting, and links to /tasks/:taskId.
 */
export default function TasksListPage() {
  const { tasks, toggleCompleteTask, deleteTask } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('due-asc');

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    let result = tasks.filter((t) => {
      // 1. Category Filter
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory;

      // 2. Priority Filter
      const matchPrio = selectedPriority === 'All' || t.priority === selectedPriority;

      // 3. Status Filter
      const matchStatus = selectedStatus === 'All' || t.status === selectedStatus;

      // 4. Search Query (Title or Description or Category)
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);

      return matchCat && matchPrio && matchStatus && matchSearch;
    });

    // Sorting
    switch (sortBy) {
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'priority-high': {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        result.sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));
        break;
      }
      default:
        // default by creation or due
        break;
    }

    return result;
  }, [tasks, selectedCategory, selectedPriority, selectedStatus, searchQuery, sortBy]);

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedPriority !== 'All' ||
    selectedStatus !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setSortBy('due-asc');
  };

  return (
    <div className="tasks-page container">
      
      {/* Page Header */}
      <div className="tasks-page-header">
        <div>
          <h1 className="page-heading">Task Repository</h1>
          <p className="page-subheading">
            Manage your project milestones, filter by category and priority, and inspect dynamic details.
          </p>
        </div>

        <Link to="/add-task" className="btn btn-primary add-task-btn">
          <span>➕ Add New Task</span>
        </Link>
      </div>

      {/* Filter and Search Bar Card */}
      <section className="tasks-filter-card">
        
        {/* Search & Select Controls Row */}
        <div className="filter-controls-row">
          
          {/* Search Box */}
          <div className="task-search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by task title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="task-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Priority Select */}
          <div className="filter-select-group">
            <label htmlFor="priority-filter" className="select-label">Priority:</label>
            <select
              id="priority-filter"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="filter-select"
            >
              {taskPriorities.map((p) => (
                <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="filter-select-group">
            <label htmlFor="status-filter" className="select-label">Status:</label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              {taskStatuses.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>

          {/* Sort By Select */}
          <div className="filter-select-group">
            <label htmlFor="sort-filter" className="select-label">Sort:</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="due-asc">Default Order</option>
              <option value="priority-high">Priority: High to Low</option>
              <option value="title-asc">Title: A to Z</option>
            </select>
          </div>

          {isFiltered && (
            <button
              type="button"
              className="btn btn-secondary reset-filters-btn"
              onClick={handleResetFilters}
            >
              Reset Filters ↺
            </button>
          )}

        </div>

        {/* Category Pills Row */}
        <div className="category-tabs-row">
          <span className="category-label">Category:</span>
          <div className="category-pills">
            {taskCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* Results Count Banner */}
      <div className="results-status-banner">
        <span>
          Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> total tasks
          {selectedCategory !== 'All' && <> in <em>{selectedCategory}</em></>}
          {selectedPriority !== 'All' && <> with <em>{selectedPriority}</em> priority</>}
        </span>
      </div>

      {/* Task Cards Grid or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="empty-tasks-card">
          <span className="empty-tasks-icon">📋</span>
          <h3>No Matching Tasks</h3>
          <p>
            No tasks matched your current search criteria. Try modifying your filters or add a new task.
          </p>
          <div className="empty-actions">
            <button type="button" className="btn btn-secondary" onClick={handleResetFilters}>
              Clear Filters
            </button>
            <Link to="/add-task" className="btn btn-primary">
              ➕ Add Task
            </Link>
          </div>
        </div>
      ) : (
        <div className="task-cards-grid">
          {filteredTasks.map((t) => {
            const isCompleted = t.status === 'Completed';

            return (
              <article key={t.id} className={`task-card ${isCompleted ? 'card-completed' : ''}`}>
                
                {/* Header: Checkbox + Priority Badge + Category */}
                <div className="task-card-header">
                  <div className="checkbox-title-row">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleCompleteTask(t.id)}
                      className="task-card-checkbox"
                      aria-label={`Toggle completion for ${t.title}`}
                    />
                    <span className="task-card-cat">{t.category}</span>
                  </div>

                  <span className={`priority-badge badge-${t.priority.toLowerCase()}`}>
                    {t.priority}
                  </span>
                </div>

                {/* Title & Description with link to Dynamic Route */}
                <h3 className="task-card-title">
                  <Link to={`/tasks/${t.id}`} className="title-nav-link" title="Open task details">
                    {t.title}
                  </Link>
                </h3>

                <p className="task-card-desc">{t.description}</p>

                {/* Due Date & Status Row */}
                <div className="task-meta-row">
                  <div className="due-date-badge">
                    <span className="calendar-icon">📅</span>
                    <span>Due: <strong>{t.dueDate}</strong></span>
                  </div>

                  <span className={`status-pill pill-${t.status.toLowerCase().replace(' ', '-')}`}>
                    {t.status}
                  </span>
                </div>

                {/* Actions Footer: URL Parameter Navigation Button & Delete */}
                <div className="task-card-footer">
                  <Link to={`/tasks/${t.id}`} className="view-details-link">
                    <span>Task Details</span>
                    <span className="param-hint">(:taskId) &rarr;</span>
                  </Link>

                  <button
                    type="button"
                    className="task-delete-icon-btn"
                    onClick={() => deleteTask(t.id)}
                    title={`Delete task: ${t.title}`}
                  >
                    🗑️
                  </button>
                </div>

              </article>
            );
          })}
        </div>
      )}

    </div>
  );
}
