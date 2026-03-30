import React, { useState, useEffect } from 'react';
import { getTaskActivities } from '../services/api';
import Loader from './Loader';

const ActivityLog = ({ taskId, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivities();
  }, [taskId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getTaskActivities(taskId);
      setActivities(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load activities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      TODO: 'bg-orange-500',
      IN_PROGRESS: 'bg-blue-500',
      DONE: 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Activity Log</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {loading && <Loader />}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No activities yet</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`${getStatusColor(activity.previousStatus)} px-3 py-1 rounded-full text-sm font-semibold text-white`}>
                        {activity.previousStatus}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className={`${getStatusColor(activity.newStatus)} px-3 py-1 rounded-full text-sm font-semibold text-white`}>
                        {activity.newStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.changedAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;