import '../styles/Register.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VALID_USER_TYPES, mapUserTypeToBackend } from '../utils/userTypeUtils';
import AuthPageWrapper from './AuthPageWrapper';
import RegisterForm from '../forms/RegisterForm';
import authService from '../services/authService';

function Register() {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Combined form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedUserType: 'Select Role',
    loading: false,
    error: '',
    roleError: '',
    emailError: '',
  });

  // Update form fields with a single handler
  const updateFormField = (field, value) => {
    setFormData((prev) => {
      const updates = {
        ...prev,
        [field]: value,
      };

      // Clear role error if selecting a valid role
      if (field === 'selectedUserType' && VALID_USER_TYPES.includes(value)) {
        updates.roleError = '';
      }

      // Clear email error when email field is being edited
      if (field === 'email') {
        updates.emailError = '';
      }

      return updates;
    });
  };

  // Validate email format
  const validateEmail = (email) => {
    // Basic email validation - must contain @ followed by domain and TLD
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate inputs before submission
  const validateInputs = () => {
    const { password, confirmPassword, selectedUserType, email } = formData;
    let isValid = true;

    // Validate password match
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      isValid = false;
    }

    // Validate user type
    if (!VALID_USER_TYPES.includes(selectedUserType)) {
      setFormData((prev) => ({
        ...prev,
        roleError: 'Please select a valid role',
      }));
      isValid = false;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setFormData((prev) => ({
        ...prev,
        emailError:
          'Please enter a valid email address (e.g., user@example.com)',
      }));
      isValid = false;
    }

    return isValid;
  };

  // Prepare user data for registration
  const prepareUserData = () => {
    const { fullName, email, password, confirmPassword, selectedUserType } =
      formData;

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
      setFormData((prev) => ({ ...prev, loading: true, error: '' }));

      const userData = prepareUserData();
      await authService.register(userData);

      // Reset form and navigate to login
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedUserType: 'Select Role',
        loading: false,
        error: '',
        roleError: '',
        emailError: '',
      });

      navigate('/login');
    } catch (error) {
      // Handle registration errors
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

      setFormData((prev) => ({ ...prev, error: errorMsg, loading: false }));
    }
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

      // Manually close the <details> dropdown
      document.getElementById('user-type-dropdown').removeAttribute('open');
    }
  };

  return (
    <AuthPageWrapper>
      <RegisterForm
        formData={formData}
        updateFormField={updateFormField}
        handleSubmit={handleSubmit}
        handleUserTypeSelect={handleUserTypeSelect}
        navigate={navigate}
      />
    </AuthPageWrapper>
  );
}

export default Register;
