import axios from 'axios';

const BASE_URL = 'https://www.onepimeht.tech/api/v1';

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, userData,
      {headers: {
        'Content-Type': 'Application/json',
      }},
      { timeout: 10000 },
    );
    console.log('Register User Response:', response);
    return 'Successful registration';
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error(error.response?.data?.message || 'Failed to register user.');
  }
};

// Login User
/* export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, userData,
      {headers: {
        'Content-Type': 'Application/json',
      }},
      { timeout: 10000 },
    );
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error(error.response?.data?.message || 'Failed to log in user.');
  }
}; */

// Logout User
/* export const logoutUser = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/users/logout`);
    return response.data;
  } catch (error) {
    console.error('Error logging out user:', error);
    throw new Error(error.response?.data?.message || 'Failed to log out user.');
  }
}; */

// Get User Profile
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/users_profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile.');
  }
};

// Update User Profile
export const updateUserProfile = async (token, userData) => {
  try {
    const response = await axios.put(`${BASE_URL}/update_user`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user profile.');
  }
};

// Delete User Profile
export const deleteUserProfile = async (token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete_user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete user profile.');
  }
};
