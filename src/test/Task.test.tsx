import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Task from '../components/Task';
import type { Task as TaskType } from '../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Task', () => {
  const mockTask: TaskType = {
    id: '1',
    description: 'Test task',
    isComplete: false,
    dueDate: new Date('2024-12-31'),
  };

  const mockUpdateTask = vi.fn();

  beforeEach(() => {
    mockUpdateTask.mockClear();
  });

  it('renders task details correctly', () => {
    render(<Task task={mockTask} updateTask={mockUpdateTask} />);

    expect(screen.queryByText(/Test task/)).toBeDefined();
    expect(screen.queryByText(/Incomplete/)).toBeDefined();
    expect(screen.queryByText(/12\/31\/2024/)).toBeDefined();
  });

  it('calls updateTask when clicked', async () => {
    const user = userEvent.setup();
    render(<Task task={mockTask} updateTask={mockUpdateTask} />);

    await user.click(screen.getByRole('listitem'));
    expect(mockUpdateTask).toHaveBeenCalledWith(mockTask);
  });

  it('shows correct styling for complete tasks', () => {
    const completeTask = { ...mockTask, isComplete: true };
    render(<Task task={completeTask} updateTask={mockUpdateTask} />);

    const taskElement = screen.getByRole('listitem');
    expect(taskElement).toHaveClass('bg-green-50');
    expect(taskElement).toHaveClass('border-green-200');
  });

  it('shows correct styling for past due tasks', () => {
    const pastDueTask = { ...mockTask, isPastDue: true };
    render(<Task task={pastDueTask} updateTask={mockUpdateTask} />);

    const taskElement = screen.getByRole('listitem');
    expect(taskElement).toHaveClass('bg-red-50');
    expect(taskElement).toHaveClass('border-red-200');
  });
});
