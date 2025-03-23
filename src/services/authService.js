import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Create axios instance with appropriate headers
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
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
        
        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const res = await axios.post(`${API_URL}token/refresh/`, { refresh: refreshToken });
                    localStorage.setItem('access_token', res.data.access);
                    
                    // Retry original request with new token
                    originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // If refresh token is expired, log out user
                logout();
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// Authentication service functions
const register = async (userData) => {
    const response = await axiosInstance.post('register/', userData);
    return response.data;
};

const login = async (email, password) => {
    const response = await axiosInstance.post('token/', { email, password });
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Save user info
        const userInfo = parseJwt(response.data.access);
        localStorage.setItem('user', JSON.stringify(userInfo));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const forgotPassword = async (email) => {
    const response = await axiosInstance.post('password-reset/', { email });
    return response.data;
};

const resetPassword = async (uidb64, token, password, password2) => {
    const response = await axiosInstance.post('password-reset-confirm/', {
        uidb64,
        token,
        password,
        password2
    });
    return response.data;
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
    axiosInstance
};

export default authService;