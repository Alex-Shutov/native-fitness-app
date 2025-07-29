import { atom,selector } from 'recoil';
import ProgressService from '~/pages/progress/api/progress.service';

export const progressState = atom({
  key: 'progressState',
  default: {
    goalProgress: 0,
    weight: {
      currentWeight: 0,
      startWeight: 0,
      targetWeight: 0
    }
  }
});



export const progressQuery = selector({
  key: 'progressQuery',
  get:  () => {
    return  ProgressService.getProgressData();
  }
});