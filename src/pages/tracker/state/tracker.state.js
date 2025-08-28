// src/pages/tracker/state/tracker.state.js

import { atom, selector } from 'recoil';
import TrackerService from '../api/tracker.service';

const HABIT_NAMES = [
  'Есть овощи перед едой',
  'Пережевывать пищу',
  'Пешая прогулка',
  'Последний прием пищи не ранее чем за 4 часа до сна',
  'Отказ от сахара'
];

export const mapApiTrackToFrontend = (apiTrack) => {
  if (!apiTrack) return { tracks: [], isLoading: false, error: null };

  const daysPerHabit = 5;
  const habitsStatus = apiTrack.habitsStatus || '0000000000000000000000000';
  const habitsCount = apiTrack.habitsCount || daysPerHabit;

  const tracks = Array.from({ length: habitsCount }).map((_, habitIndex) => {
    const startIndex = habitIndex * daysPerHabit;
    const completionStatus = habitsStatus
      .slice(startIndex, startIndex + daysPerHabit)
      .split('')
      .map(Number);

    return {
      id: `habit-${habitIndex}`,
      trackerId: apiTrack.id,
      title: HABIT_NAMES[habitIndex] || `Привычка ${habitIndex + 1}`,
      startDate: apiTrack.startDate,
      completionStatus,
      createdAt: apiTrack.startDate,
      isDoublePoints: habitIndex === apiTrack.doubleHabitIndex
    };
  });

  return {
    tracks,
    trackerId: apiTrack.id,
    programMonth: apiTrack.programMonth || 1,
    weekInMonth: apiTrack.weekInMonth || 1,
    isCompleted: apiTrack.isCompleted || false,
    isLoading: false,
    error: null
  };
};

export const trackerState = atom({
  key: 'trackerState',
  default: {
    tracks: [],
    trackerId: null,
    programMonth: 1,
    weekInMonth: 1,
    isCompleted: false,
    isLoading: true,
    error: null
  }
});

export const trackerVersion = atom({
  key: 'trackerVersionState',
  default: 0,
});

export const trackerQuery = selector({
  key: 'trackerQuery',
  get: async ({ get }) => {
    try {
      let apiTracker = await TrackerService.getTracks();
      if (!apiTracker) {
        apiTracker = await TrackerService.createTrack();
      }

      return mapApiTrackToFrontend(apiTracker);
    } catch (error) {
      return {
        tracks: [],
        trackerId: null,
        programMonth: 1,
        weekInMonth: 1,
        isCompleted: false,
        isLoading: false,
        error: error.message,
      };
    }
  },
  set: ({ set,get }, newValue) => {
    set(trackerState, newValue);
  },
});