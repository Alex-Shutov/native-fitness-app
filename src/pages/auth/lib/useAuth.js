import { useState, useEffect, useCallback } from 'react';
import AuthService from '~/pages/auth/api/auth.service';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authState } from '~/pages/auth/models/auth.atom';
import StorageService from '@react-native-async-storage/async-storage/src';
import { useNavigation } from '@react-navigation/native';
import { progressState } from '~/pages/progress/models/progress.model';


/**
 * Custom hook for authentication state and operations
 */
const useAuth = () => {
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
          console.log(userData, progressData, 'data');

          setAuthState(userData);
          setRecoilProgress(progressData);

        }
      } catch (err) {
        setError(err.message);
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
      setError(err.response?.data || err.message);
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
        // After registration, we automatically log in
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

  return {
    isAuthenticated,
    user:authUserState,
    loading,
    error,
    login,
    register,
    logout,
  };
};

export default useAuth;
