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

const DAYS_PER_HABIT = 5;

export const mapApiHabitToFrontend = (habit) => {
  if (!habit) return null;
  const pattern = habit.pattern || '00000';
  const completionStatus = pattern
    .slice(0, DAYS_PER_HABIT)
    .padEnd(DAYS_PER_HABIT, '0')
    .split('')
    .map(Number);
  return {
    id: `habit-${habit.id}`,
    habitId: habit.id,
    title: habit.name != null && habit.name !== '' ? String(habit.name) : 'Цель',
    completionStatus,
    startDate: habit.createdAt,
    createdAt: habit.createdAt,
    isHabit: true,
    isDoublePoints: false,
  };
};

export const mapApiTrackToFrontend = (apiTrack) => {
  if (!apiTrack) return { tracks: [], isLoading: false, error: null };

  const habitsStatus = apiTrack.habitsStatus || '0000000000000000000000000';
  const habitsCount = apiTrack.habitsCount || DAYS_PER_HABIT;

  const tracks = Array.from({ length: habitsCount }).map((_, habitIndex) => {
    const startIndex = habitIndex * DAYS_PER_HABIT;
    const completionStatus = habitsStatus
      .slice(startIndex, startIndex + DAYS_PER_HABIT)
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