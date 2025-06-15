// src/shared/api/tracker.service.js

import apiClient from '~/shared/api/client';
import { mapApiTrackToFrontend } from '~/pages/tracker/state/tracker.state';

const TrackerService = {
  async getTracks() {
    try {
      const response = await apiClient.get('/api/trackers');
      return response.data;
    } catch (error) {
      console.error('Error fetching tracks:', error);
      throw error;
    }
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

  async createTrack(title, daysStatus) {
    try {
      const createResponse = await apiClient.post(`/api/trackers`, null, {
        params: {
          description: title,
        },
      });
      const trackId = createResponse.data.id;

      const updatedResponse = await this.updateTrackStatus(trackId, daysStatus);

      return mapApiTrackToFrontend(updatedResponse);
    } catch (error) {
      console.error('Error creating track:', error);
      throw error;
    }
  },
};

export default TrackerService;
