import { atom } from 'recoil';
import { MOCK_TRACKS } from '~/pages/tracker/models/tracker';

export const trackerState = atom({
  key: 'trackerState',
  default: {
    tracks: MOCK_TRACKS,
  },
});