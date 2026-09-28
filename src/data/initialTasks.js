/**
 * Initial Seed Tasks for Assignment 6
 * Fields: title, description, priority, category, dueDate, status.
 */
export const initialTasks = [
  {
    id: 'task-101',
    title: 'Finalize Cloud Architecture Migration',
    description: 'Review AWS infrastructure migration roadmap, configure auto-scaling policies, and conduct load testing before production cutover.',
    priority: 'High',
    category: 'Work',
    dueDate: '28 Aug 2026',
    status: 'In Progress',
    createdAt: '2026-08-20'
  },
  {
    id: 'task-102',
    title: 'Q3 Financial Budget & Audit Submission',
    description: 'Consolidate departmental expense reports, reconcile vendor invoices, and prepare compliance audit summary for leadership review.',
    priority: 'High',
    category: 'Finance',
    dueDate: '28 Aug 2026',
    status: 'Pending',
    createdAt: '2026-08-21'
  },
  {
    id: 'task-103',
    title: 'Design System Component Tokens Refactor',
    description: 'Update CSS design tokens for dark mode glassmorphism, audit accessibility contrast ratios, and document button states in Storybook.',
    priority: 'Medium',
    category: 'Design',
    dueDate: '30 Aug 2026',
    status: 'Pending',
    createdAt: '2026-08-22'
  },
  {
    id: 'task-104',
    title: 'Doctor Appointment & Health Checkup',
    description: 'Annual comprehensive health checkup and consultation at Apex Medical Center.',
    priority: 'Medium',
    category: 'Personal',
    dueDate: '02 Sep 2026',
    status: 'Pending',
    createdAt: '2026-08-23'
  },
  {
    id: 'task-105',
    title: 'Submit React Router Assignment Project',
    description: 'Implement dynamic URL parameters, nested routes, and basic protected routing with clean documentation and tests.',
    priority: 'High',
    category: 'Study',
    dueDate: '28 Aug 2026',
    status: 'Completed',
    createdAt: '2026-08-24'
  },
  {
    id: 'task-106',
    title: 'Customer Feedback Analysis & Synthesis',
    description: 'Synthesize 120 customer survey responses from the beta launch and prepare key feature improvement recommendations.',
    priority: 'Low',
    category: 'Work',
    dueDate: '05 Sep 2026',
    status: 'Completed',
    createdAt: '2026-08-19'
  }
];

export const taskCategories = ['All', 'Work', 'Personal', 'Finance', 'Design', 'Study', 'Urgent'];
export const taskPriorities = ['All', 'High', 'Medium', 'Low'];
export const taskStatuses = ['All', 'Pending', 'In Progress', 'Completed'];
