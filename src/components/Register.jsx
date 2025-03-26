import '../styles/Register.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VALID_USER_TYPES, mapUserTypeToBackend } from '../utils/userTypeUtils';
import AuthPageWrapper from './AuthPageWrapper';
import RegisterForm from '../forms/RegisterForm';
import authService from '../services/authService';

function Register() {
  const navigate = useNavigate();

  // Form state
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedUserType: 'Select Role',
  });

  // UI state
  const [uiState, setUiState] = useState({
    isUserMenuOpen: false,
    loading: false,
    error: '',
    roleError: '',
  });

  // Reset form state
  const resetState = () => {
    setFormState({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      selectedUserType: 'Select Role',
    });
    setUiState(prevState => ({
      ...prevState,
      loading: false,
      error: '',
      roleError: '',
    }));
  };

  // Validate inputs before submission
  const validateInputs = () => {
    const { password, confirmPassword, selectedUserType } = formState;

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return false;
    }

    if (!VALID_USER_TYPES.includes(selectedUserType)) {
      setUiState(prevState => ({
        ...prevState,
        roleError: 'Please select a valid role',
      }));
      return false;
    }

    return true;
  };

  // Prepare user data for registration
  const prepareUserData = () => {
    const { fullName, email, password, confirmPassword, selectedUserType } = formState;
    
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const username = email.split('@')[0];

    return {
      username: username,
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password,
      password2: confirmPassword,
      user_type: mapUserTypeToBackend(selectedUserType),
    };
  };

  // Handle registration logic
  const register = async () => {
    try {
      setUiState(prevState => ({ ...prevState, loading: true, error: '' }));
      
      const userData = prepareUserData();
      await authService.register(userData);
      
      resetState();
      navigate('/login');
    } catch (error) {
      handleRegistrationError(error);
    } finally {
      setUiState(prevState => ({ ...prevState, loading: false }));
    }
  };

  // Handle registration errors
  const handleRegistrationError = (error) => {
    let errorMsg = 'Registration failed';

    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
      if (typeof errorData === 'string') {
        errorMsg = errorData;
      } else if (typeof errorData === 'object') {
        errorMsg = Object.keys(errorData)
          .map((key) => `${key}: ${errorData[key].join(' ')}`)
          .join('\n');
      }
    } else {
      errorMsg = 'Network error. Please try again later.';
    }

    setUiState(prevState => ({ ...prevState, error: errorMsg }));
  };

  // Update form inputs
  const updateFormField = (field, value) => {
    setFormState(prevState => ({ ...prevState, [field]: value }));
  };

  // Update UI state
  const updateUiState = (field, value) => {
    setUiState(prevState => ({ ...prevState, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      await register();
    }
  };

  // Handle user type selection
  const handleUserTypeSelect = (type) => {
    if (VALID_USER_TYPES.includes(type)) {
      updateFormField('selectedUserType', type);
      updateUiState('isUserMenuOpen', false);
    }
  };

  // Clear role error when a valid role is selected
  useEffect(() => {
    if (uiState.roleError && VALID_USER_TYPES.includes(formState.selectedUserType)) {
      updateUiState('roleError', '');
    }
  }, [formState.selectedUserType, uiState.roleError]);

  return (
    <AuthPageWrapper>
      <RegisterForm
        formState={formState}
        uiState={uiState}
        updateFormField={updateFormField}
        updateUiState={updateUiState}
        handleSubmit={handleSubmit}
        handleUserTypeSelect={handleUserTypeSelect}
        navigate={navigate}
      />
    </AuthPageWrapper>
  );
}

export default Register;