import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardPage from './pages/DashboardPage';
import TasksListPage from './pages/TasksListPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import AddTaskPage from './pages/AddTaskPage';
import CompletedTasksPage from './pages/CompletedTasksPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            {/* Master Layout Route (Nested Routes Outlet) */}
            <Route path="/" element={<AppLayout />}>
              
              {/* 1. Protected Dashboard Page (Assignment 7: Protected Dashboard) */}
              <Route
                index
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="dashboard" element={<Navigate to="/" replace />} />

              {/* 2. Tasks Routes (Nested Structure from Assignment 6) */}
              <Route path="tasks">
                <Route index element={<TasksListPage />} />
                
                {/* 3. Task Details Page (Dynamic Route with URL Parameters: :taskId) */}
                <Route path=":taskId" element={<TaskDetailsPage />} />
              </Route>

              {/* 4. Add Task Page (Protected Route) */}
              <Route
                path="add-task"
                element={
                  <ProtectedRoute>
                    <AddTaskPage />
                  </ProtectedRoute>
                }
              />

              {/* 5. Completed Tasks Page */}
              <Route path="completed" element={<CompletedTasksPage />} />

              {/* 6. Authentication Page (Assignment 7: Login, Validation, JWT Simulation) */}
              <Route path="login" element={<LoginPage />} />

              {/* 7. 404 Catch-All Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}
