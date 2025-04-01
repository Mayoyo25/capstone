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
      userData: null,
      isUserMenuOpen: false,

      // Simplified initialization method
      initializeAuth: () => {
        const currentUser = authService.getCurrentUser();

        if (currentUser) {
          set({
            isAuthenticated: true,
            userData: currentUser,
            loading: false,
            error: null,
          });
        } else {
          set({
            isAuthenticated: false,
            userData: null,
            loading: false,
            error: null,
          });
        }
      },

      setSelectedUserType: (type) => set({ selectedUserType: type }),
      setIsUserMenuOpen: (isOpen) => set({ isUserMenuOpen: isOpen }),

      login: (userData) => {
        set({
          isAuthenticated: true,
          userData: userData,
          loading: false,
          error: null,
        });
      },

      logout: () => {
        authService.logout();
        set({
          isAuthenticated: false,
          userData: null,
          loading: false,
          error: null,
          selectedUserType: 'Select Role',
        });
      },

      resetState: () =>
        set({
          isAuthenticated: false,
          loading: false,
          error: null,
          selectedUserType: 'Select Role',
          userData: null,
          isUserMenuOpen: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userData: state.userData,
      }),
    }
  )
);

export default useAuthStore;
