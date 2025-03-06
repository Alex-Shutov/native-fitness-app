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
    },
});