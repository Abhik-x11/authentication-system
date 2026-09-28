import React, { createContext, useState, useEffect } from 'react';
import { initialTasks } from '../data/initialTasks';

const TASK_STORAGE_KEY = 'taskflow_tasks_v1';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(TASK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return initialTasks;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  // Add Task
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: taskData.status || 'Pending'
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  // Update Task
  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Task Completion
  const toggleCompleteTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  // Get Task by ID (for Dynamic Routes)
  const getTaskById = (id) => {
    return tasks.find((t) => t.id === id);
  };

  // Clear all completed tasks
  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => t.status !== 'Completed'));
  };

  // Reset demo data
  const resetToDefaultData = () => {
    setTasks(initialTasks);
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(initialTasks));
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleCompleteTask,
    getTaskById,
    clearCompleted,
    resetToDefaultData
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export { TaskContext };
