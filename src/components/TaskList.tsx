import type { Task as TaskType } from '../types';
import Task from './Task';

interface TaskListProps {
  tasks: TaskType[];
  updateTask: (task: Task) => void;
}

const sortTasks = (tasks: Task[]) => {
  tasks.sort(
    (a, b) =>
      (a.dueDate ? new Date(a.dueDate).getTime() : 0) -
      (b.dueDate ? new Date(b.dueDate).getTime() : 0)
  );

  const pastDueTasks: Task[] = [];
  const incompleteTasks: Task[] = [];
  const completeTasks: Task[] = [];

  for (const task of tasks) {
    if (task.isComplete) {
      completeTasks.push(task);
    } else if (task.dueDate && new Date(task.dueDate) < new Date()) {
      task.isPastDue = true;
      pastDueTasks.push(task);
    } else {
      task.isPastDue = false;
      incompleteTasks.push(task);
    }
  }

  return [...pastDueTasks, ...incompleteTasks, ...completeTasks];
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
