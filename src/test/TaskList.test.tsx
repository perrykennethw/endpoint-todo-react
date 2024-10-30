import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../components/TaskList';
import { sortTasks } from '../components/TaskList';
import type { Task } from '../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      description: 'Past due task',
      isComplete: false,
      dueDate: new Date('2023-01-01'),
    },
    {
      id: '2',
      description: 'Future task',
      isComplete: false,
      dueDate: new Date('2025-01-01'),
    },
    {
      id: '3',
      description: 'Completed task',
      isComplete: true,
      dueDate: new Date('2024-01-01'),
    },
  ];

  const mockUpdateTask = vi.fn();

  beforeEach(() => {
    mockUpdateTask.mockClear();
  });

  it('renders all tasks', () => {
    render(<TaskList tasks={mockTasks} updateTask={mockUpdateTask} />);

    expect(screen.queryByText(/Past due task/)).toBeDefined();
    expect(screen.queryByText(/Future task/)).toBeDefined();
    expect(screen.queryByText(/Completed task/)).toBeDefined();
  });

  it('renders empty list when no tasks provided', () => {
    render(<TaskList tasks={[]} updateTask={mockUpdateTask} />);

    const list = screen.queryByRole('list');
    expect(list?.children).toHaveLength(0);
  });

  it('calls updateTask when marking a task complete', async () => {
    const task = mockTasks[0];
    render(<TaskList tasks={mockTasks} updateTask={mockUpdateTask} />);
    const checkbox = screen.queryByRole('checkbox', { name: /Past due task/ });
    await userEvent.click(checkbox!);

    expect(mockUpdateTask).toHaveBeenCalledWith({
      ...task,
      isComplete: true,
    });
  });
});

describe('sortTasks', () => {
  const createTask = (
    id: string,
    isComplete: boolean = false,
    dueDate?: string
  ): Task => ({
    id,
    description: `Task ${id}`,
    isComplete,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    isPastDue: false,
  });

  it('should sort tasks with past due tasks first, then incomplete, then complete', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString(); // 24 hours ago
    const tomorrow = new Date(Date.now() + 86400000).toISOString();

    const tasks: Task[] = [
      createTask('1', true, tomorrow), // complete, future
      createTask('2', false, yesterday), // incomplete, past due
      createTask('3', false, tomorrow), // incomplete, future
      createTask('4', true, yesterday), // complete, past
    ];

    const sortedTasks = sortTasks(tasks);

    expect(sortedTasks[0].id).toBe('2'); // past due first
    expect(sortedTasks[1].id).toBe('3'); // incomplete next
    expect(sortedTasks[2].id).toBe('1'); // complete last
    expect(sortedTasks[3].id).toBe('4'); // complete last
    expect(sortedTasks[0].isPastDue).toBe(true);
    expect(sortedTasks[1].isPastDue).toBe(false);
  });

  it('should handle tasks without due dates', () => {
    const tasks: Task[] = [
      createTask('1', true), // complete, no due date
      createTask('2', false), // incomplete, no due date
      createTask('3', false), // incomplete, no due date
    ];

    const sortedTasks = sortTasks(tasks);

    expect(sortedTasks[0].id).toBe('2'); // incomplete first
    expect(sortedTasks[1].id).toBe('3'); // incomplete first
    expect(sortedTasks[2].id).toBe('1'); // complete last
  });

  it('should mark past due tasks correctly', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const tomorrow = new Date(Date.now() + 86400000).toISOString();

    const tasks: Task[] = [
      createTask('1', false, yesterday),
      createTask('2', false, tomorrow),
    ];

    const sortedTasks = sortTasks(tasks);

    expect(sortedTasks[0].isPastDue).toBe(true);
    expect(sortedTasks[1].isPastDue).toBe(false);
  });

  it('should handle empty task list', () => {
    const tasks: Task[] = [];
    const sortedTasks = sortTasks(tasks);
    expect(sortedTasks).toHaveLength(0);
  });

  it('should sort tasks by due date within each category', () => {
    const daysAgo3 = new Date(Date.now() - 86400000 * 3).toISOString(); // 3 days ago
    const daysAgo1 = new Date(Date.now() - 86400000).toISOString(); // 1 day ago
    const tomorrow = new Date(Date.now() + 86400000).toISOString(); // 1 day from now
    const daysAhead3 = new Date(Date.now() + 86400000 * 3).toISOString(); // 3 days from now

    const tasks: Task[] = [
      createTask('1', false, daysAhead3), // incomplete, future (later)
      createTask('2', true, tomorrow), // complete
      createTask('3', false, daysAgo1), // overdue (more recent)
      createTask('4', false, tomorrow), // incomplete, future (sooner)
      createTask('5', false, daysAgo3), // overdue (older)
      createTask('6', true, daysAgo1), // complete
    ];

    const sortedTasks = sortTasks(tasks);

    // Overdue tasks should be first, sorted by date (oldest first)
    expect(sortedTasks[0].id).toBe('5'); // oldest overdue
    expect(sortedTasks[1].id).toBe('3'); // more recent overdue

    // Incomplete future tasks next, sorted by due date
    expect(sortedTasks[2].id).toBe('4'); // sooner future task
    expect(sortedTasks[3].id).toBe('1'); // later future task

    // Completed tasks last
    expect(sortedTasks[4].id).toBe('2'); // completed
    expect(sortedTasks[5].id).toBe('6'); // completed
  });

  it('should sort tasks according to business rules', () => {
    const now = new Date();
    const daysAgo3 = new Date(now.setDate(now.getDate() - 3));
    const daysAgo1 = new Date(now.setDate(now.getDate() + 2));
    const tomorrow = new Date(now.setDate(now.getDate() + 2));
    const daysAhead3 = new Date(now.setDate(now.getDate() + 2));

    const tasks: Task[] = [
      createTask('1', false, daysAhead3.toISOString()), // incomplete, future (later)
      createTask('2', true, tomorrow.toISOString()), // complete
      createTask('3', false, daysAgo1.toISOString()), // overdue (more recent)
      createTask('4', false, tomorrow.toISOString()), // incomplete, future (sooner)
      createTask('5', false, daysAgo3.toISOString()), // overdue (older)
      createTask('6', true, daysAgo1.toISOString()), // complete
    ];

    const sortedTasks = sortTasks(tasks);

    // Verify overdue tasks are first, sorted by date (oldest first)
    expect(sortedTasks[0].id).toBe('5'); // oldest overdue
    expect(sortedTasks[1].id).toBe('3'); // more recent overdue
    expect(sortedTasks[0].isPastDue).toBe(true);
    expect(sortedTasks[1].isPastDue).toBe(true);

    // Verify incomplete future tasks are next, sorted by due date
    expect(sortedTasks[2].id).toBe('4'); // sooner future task
    expect(sortedTasks[3].id).toBe('1'); // later future task
    expect(sortedTasks[2].isPastDue).toBe(false);
    expect(sortedTasks[3].isPastDue).toBe(false);

    // Verify completed tasks are last
    expect(sortedTasks[4].id).toBe('2');
    expect(sortedTasks[5].id).toBe('6');
    expect(sortedTasks[4].isComplete).toBe(true);
    expect(sortedTasks[5].isComplete).toBe(true);
  });
});
