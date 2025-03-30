import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://capstone-api-issr.onrender.com/users/';

// Create axios instance with appropriate headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Helper function to retrieve access token from cookies
const getAccessToken = () => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='));
  return cookie ? cookie.split('=')[1] : null;
};

// Helper function to retrieve refresh token from cookies
const getRefreshToken = () => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('refresh_token='));
  return cookie ? cookie.split('=')[1] : null;
};

// Helper function to retrieve CSRF token from cookies
const getCsrfToken = () => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : null;
};

// Add interceptor to check token expiration and refresh if needed
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    const csrfToken = getCsrfToken();

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);

      // Check if token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        try {
          const newAccessToken = await refreshAccessToken();
          config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        } catch (error) {
          console.error('Failed to refresh token:', error);
          logout();
          throw new Error('Session expired. Please log in again.');
        }
      } else {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    // Add CSRF token to headers
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token Refresh Error:', refreshError);
        logout();
        throw new Error('Session expired. Please log in again.');
      }
    }

    // Handle other errors
    handleApiError(error);
  }
);

// Helper function to refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    logout();
    throw new Error('No refresh token available.');
  }

  try {
    const response = await axios.post(`${API_URL}token/refresh/`, {
      refresh: refreshToken,
    });
    const newAccessToken = response.data.access;

    // Update the access token cookie
    document.cookie = `access_token=${newAccessToken}; HttpOnly; Secure; SameSite=Strict`;

    return newAccessToken;
  } catch (error) {
    logout();
    throw new Error('Failed to refresh token.');
  }
};

// Centralized error handling utility
const handleApiError = (error) => {
  console.error('API Error:', error.response ? error.response.data : error);

  let errorMessage = 'An unexpected error occurred.';
  if (error.response) {
    errorMessage = 'Invalid request. Please try again later.';
  } else if (error.request) {
    errorMessage = 'Network error. Please check your internet connection.';
  }

  throw new Error(errorMessage);
};

// Authentication service functions
const register = async (userData) => {
  try {
    const response = await axiosInstance.post('register/', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('token/', { email, password });

    // Parse user info from the access token
    const userInfo = parseJwt(getAccessToken());
    localStorage.setItem('user', JSON.stringify(userInfo));

    return response.data;
  } catch (error) {
    console.error(
      'Login API Error:',
      error.response ? error.response.data : error
    );

    if (error.response) {
      throw new Error(error.response.data.detail || 'Invalid credentials.');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

const logout = () => {
  // Clear local storage
  localStorage.removeItem('user');

  // Redirect to login page
  window.location.href = '/login';
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('password-reset/', { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const resetPassword = async (uidb64, token, password, password2) => {
  try {
    const response = await axiosInstance.post('password-reset-confirm/', {
      uidb64,
      token,
      password,
      password2,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Helper function to parse JWT token
const parseJwt = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  axiosInstance,
};

export default authService;
