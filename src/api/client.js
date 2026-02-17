import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:5038/api',
  timeout: 120000,  // ← أضيفي السطر ده (2 دقيقة)
  headers: { 'Content-Type': 'application/json' }
});

// تضيف التوكن تلقائيًا لكل request
client.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || 
                JSON.parse(localStorage.getItem('auth') || '{}')?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
