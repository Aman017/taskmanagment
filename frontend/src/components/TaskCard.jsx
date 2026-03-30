import React, { useState } from 'react';
import { updateTaskStatus, deleteTask, improveDescription } from '../services/api';
import ActivityLog from './ActivityLog';

const TaskCard = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [improvingDescription, setImprovingDescription] = useState(false);

  const statusColors = {
    TODO: 'bg-orange-500',
    IN_PROGRESS: 'bg-blue-500',
    DONE: 'bg-green-500'
  };

  const getNextStatus = (currentStatus) => {
    const transitions = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: null
    };
    return transitions[currentStatus];
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(task.status);
    if (!nextStatus) return;

    try {
      setLoading(true);
      setError('');
      await updateTaskStatus(task._id, nextStatus);
      onTaskUpdate();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await deleteTask(task._id);
        onTaskDelete();
      } catch (err) {
        setError('Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImproveDescription = async () => {
    try {
      setImprovingDescription(true);
      setError('');
      const response = await improveDescription(task._id);
      onTaskUpdate();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to improve description');
    } finally {
      setImprovingDescription(false);
    }
  };

  const nextStatus = getNextStatus(task.status);

  return (
    <>
      <div className="card p-6 hover:transform hover:scale-105 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex-1">{task.title}</h3>
          <button 
            onClick={handleDelete} 
            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{task.description || 'No description'}</p>
        
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <span className={`${statusColors[task.status]} status-badge`}>
            {task.status}
          </span>
          <span className="text-xs text-gray-400">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="space-y-2">
          {nextStatus && (
            <button 
              onClick={handleStatusUpdate} 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              disabled={loading}
            >
              Move to {nextStatus}
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setShowActivityLog(true)} 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              View Activity
            </button>
            
            <button 
              onClick={handleImproveDescription} 
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              disabled={improvingDescription}
            >
              {improvingDescription ? '✨ Improving...' : '✨ Improve'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
      
      {showActivityLog && (
        <ActivityLog 
          taskId={task._id} 
          onClose={() => setShowActivityLog(false)} 
        />
      )}
    </>
  );
};

export default TaskCard;