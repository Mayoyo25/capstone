import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authService from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      loading: false,
      error: null,
      selectedUserType: 'Select Role',

      user: {
        email: '',
        fullName: '',
        userType: 'User Role',
      },
      isUserMenuOpen: false,

      // Simplified initialization method
      initializeAuth: () => {
        const currentUser = authService.getCurrentUser();

        if (currentUser) {
          set({
            isAuthenticated: true,
            user: {
              email: currentUser.email || '',
              fullName: currentUser.full_name || '',
              userType: currentUser.user_type || 'User Role',
            },
            loading: false,
            error: null,
          });
        } else {
          set({
            isAuthenticated: false,
            user: {
              email: '',
              fullName: '',
              userType: 'User Role',
            },
            loading: false,
            error: null,
          });
        }
      },

      setSelectedUserType: (type) => set({ selectedUserType: type }),
      setIsUserMenuOpen: (isOpen) => set({ isUserMenuOpen: isOpen }),

      login: (userData, userType) => {
        set({
          isAuthenticated: true,
          user: { 
            email: userData.email || '',
            fullName: userData.full_name || '',
            userType: userType || 'User Role',
          },
          loading: false,
          error: null,
        });
      },

      logout: () => {
        authService.logout();
        set({
          isAuthenticated: false,
          user: {
            email: '',
            fullName: '',
            userType: 'User Role',
          },
          loading: false,
          error: null,
          selectedUserType: 'Select Role',
        });
      },

      resetState: () => set({
        isAuthenticated: false,
        loading: false,
        error: null,
        selectedUserType: 'Select Role',
        user: {
          email: '',
          fullName: '',
          userType: 'User Role',
        },
        isUserMenuOpen: false,
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
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