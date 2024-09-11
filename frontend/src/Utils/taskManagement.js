import axios from 'axios';

const BASE_URL = 'https://www.onepimeht.tech/api/v1/tasks';

// Fetch all tasks for the user
export const fetchTasks = async () => {
  const token = localStorage.getItem('todoAccessToken');
  const response = await axios.get(`${BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create a new task
export const createTask = async (taskData) => {
  const token = localStorage.getItem('todoAccessToken');
  if (token === null) {
    throw new Error('User not authenticated');
  }
  const response = await axios.post(`${BASE_URL}`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'Application/json',
    }
  });
  return response.data;
};

// Update task
export const updateTask = async (taskId, taskData) => {
  const token = localStorage.getItem('todoAccessToken');
  if (token === null) {
    throw new Error('User not authenticated');
  }
  try {
    const response = await axios.put(`${BASE_URL}/${taskId}`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`Error updating task at taskManagement: ${error.response.status}`, error.response.data);
    } else {
      console.error('Error updating task at taskManagement:', error.message);
    }
    throw error;  // Re-throw error after logging
  }
};

// Delete task
export const deleteTask = async (taskId) => {
  const token = localStorage.getItem('todoAccessToken');
  if (token === null) {
    throw new Error('User not authenticated');
  }
  const response = await axios.delete(`${BASE_URL}/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

// Search tasks
export const searchTasks = async (query) => {
  const token = localStorage.getItem('todoAccessToken');
  if (token === null) {
    throw new Error('User not authenticated');
  }
  const response = await axios.get(`${BASE_URL}?title=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};
