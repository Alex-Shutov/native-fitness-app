import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'http://5.129.205.45:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEY = 'auth_token';
// apiClient.defaults.responseType = 'blob';
// apiClient.defaults.transformResponse = [
//   (data) => {
//     if (typeof data === 'string') {
//       try {
//         data = JSON.parse(data);
//       } catch (e) {
//         // Не JSON, оставляем как есть
//       }
//     }
//     return data;
//   },
// ];

apiClient.interceptors.request.use(
  async (request) => {
    if (
      request.url.toLowerCase().includes('/register') ||
      request.url.toLowerCase().includes('/login')
    ) {
      return request;
    }

    if (request.method === 'GET' || request.method === 'get') {
      request.headers['Cache-Control'] = 'no-cache';

      if (request.params) {
        const newParams = {};

        Object.entries(request.params).forEach(([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return;
          }

          if (typeof value === 'string' && value.includes(',')) {
            const arrayValues = value.split(',').filter((v) => v.trim());
            if (arrayValues.length > 0) {
              newParams[`${key}[]`] = arrayValues;
            }
          } else {
            newParams[key] = value;
          }
        });

        request.params = newParams;
      }
    }

    request.headers.Authorization = `Bearer ${await AsyncStorage.getItem(TOKEN_KEY)}`;
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.responseType === 'blob') {
      return {
        ...response,
        data: new Blob([response.data], { type: response.headers['content-type'] }),
      };
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// Error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and notify about authentication failure
          try {
            await AsyncStorage.removeItem(TOKEN_KEY);
            // You can dispatch an event or use a callback here to notify the app
            console.warn('Authentication failed. Please log in again.');
          } catch (storageError) {
            console.error('Error clearing token:', storageError);
          }
          break;

        case 403:
          console.warn('Access forbidden. You do not have permission for this action.');
          break;

        case 404:
          console.warn('Resource not found.');
          break;

        case 500:
          console.error('Server error occurred. Please try again later.');
          break;

        default:
          console.warn(`Request failed with status: ${status}`);
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server. Please check your connection.');
    } else {
      // Error in setting up the request
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
