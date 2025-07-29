import apiClient from '~/shared/api/client';
import { mapBackendToAuthState } from '../../auth/lib/auth.mapper';

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
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType || 'image/jpeg', // используем mimeType из результата
        name: file.fileName || `avatar-${Date.now()}.jpg`
      });
      const response = await apiClient.post('/api/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        transformRequest: () => formData
      });

      return response.data;
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
