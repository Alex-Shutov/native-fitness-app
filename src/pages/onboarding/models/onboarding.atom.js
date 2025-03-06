import {atom} from "recoil";

export const onboardingState = atom({
    key: 'onboardingState',
    default: {
        completed: false,
        currentStep: 0,
        selectedGoals: [],
        primaryGoal: null,
        goalDescription: '',
        currentProgress: 0,
    },
});