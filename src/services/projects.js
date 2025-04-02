import { axiosInstance } from './axiosConfig';

export const createProject = async (formData) => {
  try {
    const token = localStorage.getItem('access-token');

    const response = await axiosInstance.post(`/projects/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle file URLs - they'll be in projectData.files[].file_url
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

// To download a file
export const downloadFile = async (fileId, fileName) => {
  try {
    const token = localStorage.getItem('access-token');

    const response = await fetch(`/files/${fileId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get file URL');
    }

    const { file_url } = await response.json();

    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = file_url;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export const getProjects = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/projects/list/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserProjects = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/projects/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProject = async (projectId, updateData) => {
  try {
    const response = await axiosInstance.patch(
      `/projects/${projectId}/`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const uploadProjectFile = async (projectId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(
      `/projects/${projectId}/upload_file/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addProjectComment = async (projectId, comment) => {
  try {
    const response = await axiosInstance.post(
      `/projects/${projectId}/add_comment/`,
      { content: comment }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
