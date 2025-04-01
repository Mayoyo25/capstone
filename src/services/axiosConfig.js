import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';

// API Base URL
const API_URL = import.meta.env.API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Function to get access token from localStorage
const getAccessToken = () => localStorage.getItem('access-token');

// Function to get refresh token
const getRefreshToken = () => localStorage.getItem('refresh-token');

// Function to refresh token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    authService.logout();
    throw new Error('No refresh token available.');
  }

  try {
    const response = await axios.post(`${API_URL}/user/token/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;

    // Update token in localStorage
    localStorage.setItem('access-token', newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    authService.logout();
    throw new Error('Session expired. Please log in again.');
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();

    if (token) {
      const decodedToken = jwtDecode(token);

      // If token is expired, refresh it
      if (decodedToken.exp * 1000 < Date.now()) {
        try {
          token = await refreshAccessToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
          throw error;
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error('Session expired. Please login again.');
          authService.logout();
          break;
        case 403:
          toast.error('You are not authorized for this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(error.response.data?.message || 'An error occurred');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
