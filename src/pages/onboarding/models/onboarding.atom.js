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


export const goalsState = atom({
    key: 'goalsState',
    default: {
        goals: [],
        loading: false,
        error: null,
    },
});