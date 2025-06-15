import StorageService from '@react-native-async-storage/async-storage/src';
import React, { createContext, useCallback, useEffect, useState } from 'react';

import { AuthService, UserService } from '../../shared/api';
import { useNavigation } from '@react-navigation/native';

// Create context
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => {},
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();


  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = await StorageService.getItem('auth_token', false);

        if (token) {
          setIsAuthenticated(true);
          const userData = await StorageService.getItem('user_data');
          setUser(userData);

          // Refresh user data in background
          try {
            const freshUserData = await UserService.getCurrentUser();
            setUser(freshUserData);
            await StorageService.setItem('user_data', freshUserData);
          } catch (refreshError) {
            console.error('Failed to refresh user data:', refreshError);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // Call login API
      const token = await AuthService.login(credentials);

      // Store token
      await StorageService.setItem('auth_token', token);

      // Get and store user data
      const userData = await UserService.getCurrentUser();
      if (!userData.diet || !userData.weight || !userData.height){
        navigation.navigate('SelectGoals')
      }

      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (err) {
      setError(err.response?.data || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(
    async (userData) => {
      try {
        setLoading(true);
        setError(null);

        // Call register API
        await AuthService.register(userData);

        // After registration, login automatically
        return await login({
          username: userData.username,
          password: userData.password,
        });
      } catch (err) {
        setError(err.response?.data || err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // Clear stored data
      await StorageService.removeItem('auth_token');
      await StorageService.removeItem('user_data');

      setIsAuthenticated(false);
      setUser(null);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user data
  const updateUser = useCallback(async (userData) => {
    try {
      setLoading(true);

      // Update user profile
      const updatedUser = await UserService.updateProfile(userData);

      // Update stored user data
      await StorageService.setItem('user_data', updatedUser);
      setUser(updatedUser);

      return updatedUser;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
