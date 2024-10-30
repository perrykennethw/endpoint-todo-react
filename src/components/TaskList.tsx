import type { Task as TaskType } from '../types';
import Task from './Task';

interface TaskListProps {
  tasks: TaskType[];
  updateTask: (task: Task) => void;
}

export const sortTasks = (tasks: Task[]): Task[] => {
  // Create a copy of tasks to avoid mutating the original array
  const tasksCopy = [...tasks];
  const now = new Date();

  // Mark past due tasks
  tasksCopy.forEach((task) => {
    if (task.dueDate && !task.isComplete && new Date(task.dueDate) < now) {
      task.isPastDue = true;
    } else {
      task.isPastDue = false;
    }
  });

  return tasksCopy.sort((a, b) => {
    // First, separate by completion status (incomplete first)
    if (a.isComplete !== b.isComplete) {
      return a.isComplete ? 1 : -1;
    }

    // For incomplete tasks, put overdue first
    if (!a.isComplete && !b.isComplete) {
      if (a.isPastDue !== b.isPastDue) {
        return a.isPastDue ? -1 : 1;
      }
    }

    // // Within each category, sort by due date
    // if (a.dueDate && b.dueDate) {
    //   return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    // }

    // Put tasks without due dates last within their category
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    return 0;
  });
};

const TaskList = ({ tasks, updateTask }: TaskListProps) => {
  return (
    <>
      <ul className="list-none">
        {sortTasks(tasks).map((task) => (
          <Task key={task.id} task={task} updateTask={updateTask} />
        ))}
      </ul>
    </>
  );
};

export default TaskList;
