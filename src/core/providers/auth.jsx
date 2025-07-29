import StorageService from '@react-native-async-storage/async-storage/src';
import React, { createContext, useCallback, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import AuthService from '../../pages/auth/api/auth.service';
import ProfileApi from '../../pages/profile/api/profile.api';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authState } from '../../pages/auth/models/auth.atom';
import { progressState } from '../../pages/progress/models/progress.model';

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
  const [authUserState,setAuthState] = useRecoilState(authState);
  const navigation = useNavigation();
  const setRecoilProgress = useSetRecoilState(progressState); // Для Recoil

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const authStatus = await AuthService.isAuthenticated();
        setIsAuthenticated(authStatus);
        if (authStatus) {
          navigation.reset({
            index: 0,
            routes: [{ name: "MainScreen" }],
          })
          const { user: userData, progress: progressData } = await AuthService.getCurrentUser();

          setAuthState(userData);
          setRecoilProgress(progressData);

        }
      } catch (err) {
        setError(err.message);
        await logout()
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      await AuthService.login(credentials);
      setIsAuthenticated(true);

      const { user: userData, progress: progressData }   = await AuthService.getCurrentUser();
      if (!userData.diet || !userData.weight || !userData.height){
        navigation.navigate('SelectGoals')
      }
      setRecoilProgress(progressData);

      setAuthState(userData);

      return true;
    } catch (err) {
      setError(err?.response?.data || err?.message || err.error);
      throw err;
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

        await AuthService.register(userData);
        return await login({
          username: userData.username,
          password: userData.password,
        });
      } catch (err) {
        setError(err?.response?.data?.error ?? err.message);
        throw err
        return false;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  // Logout function
  const logout = useCallback(async (test) => {
    try {
      setLoading(true);
      await AuthService.logout();
      setIsAuthenticated(false);
      setAuthState(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);



  // Context value
  const value = {
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
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
