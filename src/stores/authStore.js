import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authService from '../services/authService';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      loading: false,
      error: null,
      selectedUserType: 'Select Role',

      user: {
        email: '',
        password: '',
        fullName: '',
        userType: 'User Role',
        rememberMe: false,
      },
      isUserMenuOpen: false,
      // Initialize method to set authentication state
      initializeAuth: () => {
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          set({
            isAuthenticated: true,
            user: {
              email: currentUser.email || '',
              fullName: currentUser.full_name || '',
              userType: currentUser.user_type || 'User Role',
              password: '',
              rememberMe: false,
            }
          });
        } else {
          set({
            isAuthenticated: false,
            user: {
              email: '',
              password: '',
              fullName: '',
              userType: 'User Role',
              rememberMe: false,
            }
          });
        }
      },
      setSelectedUserType: (type) => set({ selectedUserType: type }),
      setIsUserMenuOpen: (isOpen) => set({ isUserMenuOpen: isOpen }),
      login: (userData, userType) => set((state) => ({
        isAuthenticated: true,
        user:{ 
          ...userData, 
          userType,
          password: '' 
        },
        loading: false,
        error: null,
      })),

      logout: () => {
        authService.logout();
        return set({
          isAuthenticated: false,
          user: {
            email: '',
            password: '',
            fullName: '',
            userType: 'User Role',
            rememberMe: false,
          },
          loading: false,
          error: null,
        });
      },

      resetState: () => set({
        isAuthenticated: false,
        loading: false,
        error: null,
        selectedUserType: 'Select Role',
        user: {
          email: '',
          password: '',
          fullName: '',
          userType: 'User Role',
          rememberMe: false,
        },
        isUserMenuOpen: false,
        roleError: '',
      }),
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: {
          email: state.user.email,
          fullName: state.user.fullName,
          userType: state.user.userType,
        }
      }),
    }
  )
);

export default useAuthStore;
