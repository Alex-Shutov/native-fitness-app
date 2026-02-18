import apiClient from '~/shared/api/client';
import { mapBackendToAuthState } from '../../auth/lib/auth.mapper';
import { APP_API_URL } from '~/shared/api/const';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Service for handling user-related API calls
 */
class ProfileService {
  /**
   * Get current user profile
   * @returns {Promise<Object>} - Promise with user data
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/api/users/me');
      return mapBackendToAuthState(response.data);
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - User profile data
   * @param {number} profileData.age - User age
   * @param {number} profileData.height - User height
   * @param {number} profileData.weight - User weight
   * @param {string} profileData.dateOfBirth - User date of birth (YYYY-MM-DD)
   * @returns {Promise<Object>} - Promise with updated user data
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/api/users/me', profileData)
      return mapBackendToAuthState(response.data);
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      const fileName = file.fileName || `avatar-${Date.now()}.jpg`;
      const mimeType = file.mimeType || 'image/jpeg';

      if (Platform.OS === 'web') {
        // в web нужно получить blob из uri, иначе бэк видит не файл
        const blob = await fetch(file.uri).then((res) => res.blob());
        formData.append('file', blob, fileName);
      } else {
        formData.append('file', {
          uri: file.uri,
          type: mimeType,
          name: fileName,
        });
      }

      const token = await AsyncStorage.getItem('auth_token');

      const response = await fetch(`${APP_API_URL}/api/users/me/avatar`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          // content-type не ставим вручную, чтобы boundary проставился корректно
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error('uploadAvatar failed', response.status, text);
        throw new Error(`uploadAvatar failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  async getAvatar() {
    try {
      const response = await apiClient.get('/api/users/me/avatar', {
        responseType: 'blob' // Указываем, что ожидаем blob
      });
      return response.data;
    } catch (error) {
      // 404 - аватар не найден, это нормальная ситуация
      if (error.response?.status !== 404) {
        this._handleError(error);
      }
      return null;
    }
  }

  /**
   * Handle API errors
   * @private
   * @param {Error} error - Error object
   */
  _handleError(error) {
    if (error.response) {
      console.error('User API error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request error:', error.message);
    }
  }
}

export const updateProfileField = async (fieldName, value) => {


  return {
    success: true,
    data: {
      [fieldName]: value,
    },
  };
};

export default new ProfileService();
