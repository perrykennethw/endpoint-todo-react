import type { Task } from '../types';

interface TaskProps {
  task: Task;
  updateTask: (task: Task) => void;
}

const getTaskClass = (task: Task) => {
  if (task.isComplete) return 'bg-green-50 border-green-200';
  if (task.isPastDue) return 'bg-red-50 border-red-200';
  return 'border-gray-200';
};

const Task = ({ task, updateTask }: TaskProps) => {
  return (
    <>
      <li
        className={`
              border-2 p-4 mb-2 rounded-md
              ${getTaskClass(task)}
            `}
        key={task.id}
        onClick={() => updateTask(task)}
      >
        {task.description} - {task.isComplete ? 'Complete' : 'Incomplete'} -{' '}
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : 'No due date'}
      </li>
    </>
  );
};

export default Task;
