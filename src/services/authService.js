import axios from 'axios';

const API_URL = 'https://capstone-api-issr.onrender.com/api/';

// Create axios instance with appropriate headers
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to add token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add interceptor to refresh token on 401 errors
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
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    logout();
                    throw new Error('No refresh token available.');
                }

                const res = await axios.post(`${API_URL}token/refresh/`, { refresh: refreshToken });
                localStorage.setItem('access_token', res.data.access);

                // Retry the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
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

// Centralized error handling utility
const handleApiError = (error) => {
    console.error('API Error:', error.response ? error.response.data : error);

    let errorMessage = 'An unexpected error occurred.';
    if (error.response) {
        if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
            errorMessage = error.response.data.non_field_errors.join(', ');
        } else {
            errorMessage = Object.values(error.response.data).flat().join(', ');
        }
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

        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Save user info
            const userInfo = parseJwt(response.data.access);
            localStorage.setItem('user', JSON.stringify(userInfo));
        }

        return response.data;
    } catch (error) {
        console.error('Login API Error:', error.response ? error.response.data : error);

        // Ensure the error is propagated correctly
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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
        return JSON.parse(atob(token.split('.')[1]));
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