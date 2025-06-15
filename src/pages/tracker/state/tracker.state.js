import { atom, selector } from 'recoil';
import TrackerService from '~/pages/tracker/api/tracker.service';

// Функция для преобразования данных из API в формат фронта
export const mapApiTrackToFrontend = (apiTrack) => ({
  id: String(apiTrack.id),
  title: apiTrack.description ?? 'Не указано', // Нужно реализовать эту функцию
  startDate: apiTrack.startDate,
  completionStatus: apiTrack.daysStatus.split('').map(Number),
  createdAt: apiTrack.startDate
});



export const trackerState = atom({
  key: 'trackerState',
  default: {
    tracks: [],
    isLoading: false,
    error: null
  }
});

export const trackerQuery = selector({
  key: 'trackerQuery',
  get: async () => {
    try {
      const apiTracks = await TrackerService.getTracks();
      const tracks = apiTracks.map(mapApiTrackToFrontend);
      return { tracks, isLoading: false, error: null };
    } catch (error) {
      return { tracks: [], isLoading: false, error: error.message };
    }
  },
  set: ({ set }, newValue) => set(trackerState, newValue)
});