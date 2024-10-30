import { useEffect, useState } from 'react';
import './App.css';
import apiClient from './utils/client';
import Task from './components/Task';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const updateTask = async (task: Task) => {
    if (task.isComplete) return false;

    try {
      const response = await apiClient.patch(`/patch/${task.id}`, {
        isComplete: !task.isComplete,
      });

      if (response.status === 200) {
        task.isComplete = !task.isComplete;
        const taskIndex = tasks.findIndex((t) => t.id === task.id);
        const currentTasks = [...tasks];
        currentTasks[taskIndex] = task;
        setTasks(currentTasks);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }

    return false;
  };

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await apiClient.get('/get');
        if (response.status === 200) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetchTasks();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>

      <TaskList tasks={tasks} updateTask={updateTask} />
    </>
  );
}

export default App;
