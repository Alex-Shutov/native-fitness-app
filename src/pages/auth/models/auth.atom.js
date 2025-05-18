// Атом для управления состоянием авторизации
import {atom} from "recoil";

export const authState = atom({
    key: 'authState',
    default: {
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        loading: false,
        gender: 'male',       // 'male' или 'female'
        age: 24,              // возраст в годах
        height: 175,          // рост в сантиметрах
        weight: 60,           // вес в килограммах
        startWeight:60,
        targetWeight: 55,     // целевой вес в килограммах

        diet: null,

        // Расчетные параметры тела
        bodyMassIndex: null,           // индекс массы тела
        chestCircumference: 85,        // объем груди в сантиметрах
        waistCircumference: 70,        // объем талии в сантиметрах
        hipCircumference: 102,         // объем бедер в сантиметрах
    },
});