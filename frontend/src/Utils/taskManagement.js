import axios from 'axios';

const BASE_URL = 'https://www.onepimeht.tech/api/v1/tasks';

// Fetch all tasks for the user
export const fetchTasks = async () => {
  let retries = 3;
  const token = localStorage.getItem('todoAccessToken');
  while (retries > 0) {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      retries--;
      if (retries === 0) console.log('Error fetching tasks', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Create a new task
export const createTask = async (taskData) => {
  let retries = 3;
  const token = localStorage.getItem('todoAccessToken');
  if (token === null) {
    throw new Error('User not authenticated');
  }
  while ( retries > 0) {
    try {
      const response = await axios.post(`${BASE_URL}`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'Application/json',
        }
      });
      return response.data;
    } catch (error) {
      retries--;
      if (retries === 0) console.log('Error creating task:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Update task
export const updateTask = async (taskId, taskData) => {
  let retries = 3;
  const token = localStorage.getItem('todoAccessToken');
  if (token === null) {
    throw new Error('User not authenticated');
  }
  while (retries > 0) {
    try {
      const response = await axios.put(`${BASE_URL}/${taskId}`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      retries--;
      if (retries === 0) {
        if (error.response) {
          console.error(`Error updating task at taskManagement: ${error.response.status}`, error.response.data);
        } else {
          console.error('Error updating task at taskManagement:', error.message);
        }
        throw error;  // Re-throw error after logging
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Delete task
export const deleteTask = async (taskId) => {
  let retries = 3;
  const token = localStorage.getItem('todoAccessToken');
  if (token === null) {
    throw new Error('User not authenticated');
  }
  while (retries > 0) {
    try {
      const response = await axios.delete(`${BASE_URL}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch(error) {
      retries--;
      if (retries === 0) {
        if (axios.isAxiosError(error)) {
          console.error('Request failed:', error.message);
          console.log('Status:', error.response?.status);
          console.log('Data:', error.response?.data);
        } else {
          console.error('Unexpected error:', error);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
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
