import axios from 'axios';
import { User } from '../types/user';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ensure the backend API is running on localhost:3000
});

// Fetch users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

// Create a user
export const createUser = async (user: User): Promise<User> => {
  const response = await api.post('/users', user);
  return response.data;
};

// Update a user
export const updateUser = async (userId: string, user: User): Promise<User> => {
  const response = await api.put(`/users/${userId}`, user);
  return response.data;
};

// Delete a user
export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};
