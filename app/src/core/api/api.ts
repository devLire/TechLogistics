import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// eslint-disable-next-line import/no-named-as-default-member
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// TODO: Interceptores
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
