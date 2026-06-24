// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TEMPORARY FIX FOR APK TESTING
const API_BASE_URL = 'https://touristsync.onrender.com/api';

console.log('[API] Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        `[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      );
    } catch (error) {
      console.log('[API] Token read error:', error.message);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global logout callback
let logoutCallback = null;

export const registerLogoutCallback = (cb) => {
  logoutCallback = cb;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(
      '[API ERROR]',
      error?.response?.status,
      error?.response?.data || error.message
    );

    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('authToken');
      } catch (_) { }

      if (logoutCallback) {
        logoutCallback();
      }
    }

    return Promise.reject(error);
  }
);

export default api;