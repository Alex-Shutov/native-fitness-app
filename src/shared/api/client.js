// src/shared/api/httpClient.js
import axios from 'axios';
import { getRecoil } from 'recoil-nexus';
import { authState } from '~/pages/auth/models/auth.atom';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // или ваш production URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем interceptor для JWT токена
apiClient.interceptors.request.use(
  (config) => {
    const auth = getRecoil(authState);
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Можно добавить логику для обновления токена или выхода
          break;
        case 403:
          // Доступ запрещен
          break;
        case 404:
          // Ресурс не найден
          break;
        case 500:
          // Ошибка сервера
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;