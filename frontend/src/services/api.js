import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

export const childrenAPI = {
  getAll: () => API.get('/children'),
  create: (data) => API.post('/children', data),
  get: (id) => API.get(`/children/${id}`),
  update: (id, data) => API.put(`/children/${id}`, data),
  delete: (id) => API.delete(`/children/${id}`),
};

export const growthAPI = {
  add: (data) => API.post('/growth', data),
  getByChild: (childId) => API.get(`/growth/${childId}`),
};

export const vaccinesAPI = {
  add: (data) => API.post('/vaccines', data),
  getByChild: (childId) => API.get(`/vaccines/${childId}`),
};

export const appointmentsAPI = {
  create: (data) => API.post('/appointments', data),
  getByChild: (childId) => API.get(`/appointments/child/${childId}`),
};

export const nutritionAPI = {
  add: (data) => API.post('/nutrition', data),
  getByChild: (childId) => API.get(`/nutrition/${childId}`),
};

export default API;
