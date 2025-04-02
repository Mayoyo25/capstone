import { jwtDecode } from 'jwt-decode';
import { axiosInstance } from './axiosConfig';

// Helper function to retrieve access token from cookies
const getAccessToken = () => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access-token='));
  return cookie ? cookie.split('=')[1] : null;
};

// Helper function to retrieve refresh token from cookies
const getRefreshToken = () => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('refresh-token='));
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
  const refreshToken = localStorage.getItem('refresh-token');
  if (!refreshToken) {
    logout();
    throw new Error('No refresh token available.');
  }

  try {
    const response = await authService.post('/user/token/refresh/', {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;

    // Store new access token
    localStorage.setItem('access-token', newAccessToken);

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
    const response = await axiosInstance.post('/user/register/', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/user/token/', {
      email,
      password,
    });

    // Store tokens securely
    localStorage.setItem('access-token', response.data.access);
    localStorage.setItem('refresh-token', response.data.refresh);

    // Decode user info from token
    const userInfo = jwtDecode(response.data.access);
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
  localStorage.removeItem('access-token');
  localStorage.removeItem('refresh-token');
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('user');
  window.location.href = '/';
};

const getCurrentUser = () => {
  const token = localStorage.getItem('access-token');
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
};

const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/user/password-reset/', {
      email,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const resetPassword = async (uidb64, token, password, password2) => {
  try {
    const response = await axiosInstance.post('/user/password-reset-confirm/', {
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

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  axiosInstance,
  getAccessToken,
  getRefreshToken,
  getCsrfToken,
  refreshAccessToken,
};

export default authService;
