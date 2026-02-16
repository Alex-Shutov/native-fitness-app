import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '~/shared/api/client';
import { mapBackendToAuthState } from '~/pages/auth/lib/auth.mapper';
import ProfileApi from '../../profile/api/profile.api';
import ProgressService from '../../progress/api/progress.service';


/**
 * Service for handling authentication related API calls
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email
   * @param {string} userData.password - Password
   * @returns {Promise} - Promise with registration result
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      this._handleError(error)
      throw error;
    }
  }

  /**
   * Login user
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - Password
   * @returns {Promise} - Promise with login result
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);

      // Store the token in AsyncStorage
      if (response.data) {
        await AsyncStorage.setItem('user_credentials', JSON.stringify(credentials));
        await AsyncStorage.setItem('auth_token', response.data);
        await this._fetchAndStoreUserData();
      }

      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Request password reset code to email
   * @param {string} email
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Validate reset code
   * @param {string} code
   */
  async validateResetCode(code) {
    try {
      const response = await apiClient.get('/api/auth/validate-reset-code', {
        params: { code },
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Reset password with code
   * @param {{token: string, newPassword: string, confirmPassword: string}} data
   */
  async resetPassword(data) {
    try {
      const response = await apiClient.post('/api/auth/reset-password', data);
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Logout user
   * @returns {Promise} - Promise indicating logout success
   */
  async logout() {
    try {
      // Clear stored token and user data
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} - Promise with authentication status
   */
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  /**
   * Get current user data from storage
   * @returns {Promise<Object|null>} - Promise with user data or null
   */
  async getCurrentUser() {
    try {
      const [userResponse, progress] = await Promise.all([
        ProfileApi.getCurrentUser(),
        ProgressService.getProgressData().catch(e => null)
      ]);
      const x = userResponse ? { user: userResponse, progress: progress ?? null } : { user: null, progress: null };
      return x
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }

  /**
   * Fetch user data and store it
   * @private
   */
  async _fetchAndStoreUserData() {
    try {
      const response = await apiClient.get('/api/users/me');
      if (response.data) {
        await AsyncStorage.setItem('user_data', JSON.stringify(mapBackendToAuthState(response.data)));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  /**
   * Handle API errors
   * @private
   * @param {Error} error - Error object
   */
  _handleError(error) {
    if (error.response) {
      // Server responded with error
      console.error('Auth API error:', error.response.data);

      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          console.error('Неверно введен логин или пароль');
          error.response.data.error = 'Неверно введен логин или пароль'
          break;
        case 409:
          error.response.data.error = 'Произошла ошибка, данный e-mail адрес уже зарегистрирован.';
          break;
        case 422:
          error.response.data.error = 'Произошла ошибка, имя пользователя уже занято.';
          break;
        case 400:
          console.error('Bad request:', error.response.data);
          error.response.data.error = 'Проверьте введенные вами данные'
          break;
        default:
          error.response.data.error = 'Произошла ошибка, попробуйте еще раз.'
          console.error(`Server error (${error.response.status}):`, error.response.data);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response received:', error.request);
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
  }
}

export default new AuthService();
