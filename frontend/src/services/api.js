import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - Backend might not be running');
    } else if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received - Check if backend is running on port 5000');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Task APIs
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response;
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
};

export const getAllTasks = async (params) => {
  try {
    const response = await api.get('/tasks', { params });
    // Ensure we return an array even if response is unexpected
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('getAllTasks did not return an array:', response.data);
      return { ...response, data: [] };
    }
    return response;
  } catch (error) {
    console.error('Get all tasks error:', error);
    throw error;
  }
};

export const getTaskById = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response;
  } catch (error) {
    console.error('Get task by ID error:', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response;
  } catch (error) {
    console.error('Update task status error:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response;
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
};

export const improveDescription = async (taskId) => {
  try {
    const response = await api.post(`/tasks/${taskId}/improve-description`);
    return response;
  } catch (error) {
    console.error('Improve description error:', error);
    throw error;
  }
};

export const getTaskActivities = async (taskId) => {
  try {
    const response = await api.get(`/activities/task/${taskId}`);
    // Ensure we return an array even if response is unexpected
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('getTaskActivities did not return an array:', response.data);
      return { ...response, data: [] };
    }
    return response;
  } catch (error) {
    console.error('Get task activities error:', error);
    throw error;
  }
};

export default api;