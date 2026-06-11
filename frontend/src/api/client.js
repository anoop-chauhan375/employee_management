import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach auth tokens
api.interceptors.request.use((config) => {
  const tokenType = localStorage.getItem('token-type');
  const uid = localStorage.getItem('uid');
  const client = localStorage.getItem('client');
  const accessToken = localStorage.getItem('access-token');

  if (tokenType && uid && client && accessToken) {
    config.headers['access-token'] = accessToken;
    config.headers['token-type'] = tokenType;
    config.headers['uid'] = uid;
    config.headers['client'] = client;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to update auth tokens
api.interceptors.response.use((response) => {
  if (response.headers['access-token']) {
    localStorage.setItem('access-token', response.headers['access-token']);
    localStorage.setItem('token-type', response.headers['token-type']);
    localStorage.setItem('uid', response.headers['uid']);
    localStorage.setItem('client', response.headers['client']);
  }
  return response;
}, (error) => {
  // If 401, clear auth data
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('access-token');
    localStorage.removeItem('token-type');
    localStorage.removeItem('uid');
    localStorage.removeItem('client');
  }
  return Promise.reject(error);
});

export default api;
