import React, { useState, useEffect } from 'react';
import { getAllTasks } from '../services/api';
import TaskCard from './TaskCard';
import Loader from './Loader';

const TaskList = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger, filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getAllTasks(params);
      
      // Ensure response.data is an array
      if (response.data && Array.isArray(response.data)) {
        setTasks(response.data);
      } else if (response.data && typeof response.data === 'object') {
        // If response is an object but not array, try to extract tasks
        console.warn('Response data is not an array:', response.data);
        setTasks([]);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err.response?.data?.error || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = () => {
    fetchTasks();
  };

  const handleTaskDelete = () => {
    fetchTasks();
  };

  const filters = [
    { value: 'all', label: 'All Tasks' },
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' }
  ];

  // Safety check - ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Your Tasks</h2>
        
        <div className="flex flex-wrap gap-2">
          {filters.map(filterOption => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === filterOption.value
                  ? 'bg-purple-500 text-white shadow-lg scale-105'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>
      
      {loading && <Loader />}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
          {safeTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white text-opacity-80 text-lg mb-2">No tasks found</div>
              <p className="text-white text-opacity-60">Create your first task to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeTasks.map(task => (
                <TaskCard 
                  key={task._id || task.id} 
                  task={task} 
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;