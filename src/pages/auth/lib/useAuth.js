import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authState } from '~/pages/auth/models/auth.atom';
import StorageService from '@react-native-async-storage/async-storage/src';
import { useNavigation } from '@react-navigation/native';
import { progressState } from '../../progress/models/progress.model';
import AuthService from '../api/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  useLayoutEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const authStatus = await AuthService.isAuthenticated();
        setIsAuthenticated(authStatus);
        if (authStatus) {
          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: "MainScreen" }],
          // })
          const { user: userData, progress: progressData } = await AuthService.getCurrentUser();

          setAuthState(userData);
          setRecoilProgress(progressData);

        }
        else {
          const credentials = await AsyncStorage.getItem('user_credentials');
          console.log('!!!!!',credentials);
          if (credentials) {
            await login(JSON.parse(credentials))

          }
        }
      } catch (err) {
        const credentials = await AsyncStorage.getItem('user_credentials');
        console.log(credentials);
        if (credentials) {
          await login(JSON.parse(credentials))
          return;
        }
        setError(err.message);
        await logout()
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const authStatus = await AuthService.isAuthenticated();
      setIsAuthenticated(authStatus);
      if (authStatus) {
        const { user: userData, progress: progressData } = await AuthService.getCurrentUser();
        setAuthState(userData);
        setRecoilProgress(progressData);
        return true;
      }
      else {
        const credentials = await AsyncStorage.getItem('user_credentials');
        if (credentials) {
          await login(JSON.parse(credentials))
          return true;
        }
      }
    } catch (err) {
      const credentials = await AsyncStorage.getItem('user_credentials');
      console.log(credentials);
      if (credentials) {
        await login(JSON.parse(credentials))
        return true;
      }
      setError(err.message);
      await logout();
      return false;
    } finally {
      setLoading(false);
    }
  },[])

  // Login functionr
  const login = useCallback(async (credentials) => {
    try {
      console.log(credentials);
      setLoading(true);
      setError(null);
      console.log(123);
      const res = await AuthService.login(credentials);
      console.log(res);
      setIsAuthenticated(true);

      const { user: userData, progress: progressData }   = await AuthService.getCurrentUser();
      if (!userData.diet || !userData.weight || !userData.height){
        navigation.navigate('SelectGoals')
      }
      setRecoilProgress(progressData);

      setAuthState(userData);

      return true;
    } catch (err) {
      console.log('1234',err.response);

      setError(err?.response?.data?.error || err?.message || err.error);
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
        console.log('12345',err);
        setError(err?.response?.data?.error ?? err.message);
        throw err
        return false;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

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

  return {
    isAuthenticated,
    user:authUserState,
    loading: loading,
    error,
    login,
    register,
    logout,
    setUser: setAuthState,
    setError,
    checkAuth
  };
};

export default useAuth;
