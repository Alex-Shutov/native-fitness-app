// src/shared/api/tracker.service.js

import apiClient from '~/shared/api/client';
import { mapApiTrackToFrontend } from '~/pages/tracker/state/tracker.state';

const TrackerService = {
  async getTracks() {
    try {
      const response = await apiClient.get('/api/trackers');
      const currentTracker = response.data[response.data.length - 1];
      return currentTracker;
    } catch (error) {
      if (error.response?.status === 404 || error.response.status === 405) {
        return null;
      }
      console.error('Error fetching tracker:', error);
      throw error;
    }
  },
  async getStats() {
    const response = await apiClient.get('/api/stat');
    return response.data;
  },

  async updateTrackStatus(trackId, daysStatus) {
    try {

      const response = await apiClient.put(`/api/trackers/${trackId}`, daysStatus);
      return response.data;
    } catch (error) {
      console.error('Error updating track status:', error);
      throw error;
    }
  },

  async createTrack(title, completionStatus) {
    try {
      const body = title != null ? { title, habitsStatus: (completionStatus || []).join('') } : undefined;
      const response = await apiClient.post('/api/trackers', body);
      return response.data;
    } catch (error) {
      console.error('Error creating tracker:', error);
      throw error;
    }
  }
}

export default TrackerService;
