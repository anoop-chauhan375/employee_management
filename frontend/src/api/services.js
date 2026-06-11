import api from './client';

export const authService = {
  signIn: (email, password) => api.post('/auth/sign_in', { email, password }),
  signOut: () => api.delete('/auth/sign_out'),
  getMe: () => api.get('/auth/me'),
};

export const employeeService = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', { employee: data }),
  update: (id, data) => api.patch(`/employees/${id}`, { employee: data }),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const insightService = {
  getDashboard: () => api.get('/insights/dashboard'),
  getCountries: () => api.get('/countries'),
  getCountryStats: (country) => api.get('/insights/country_salary_stats', { params: { country } }),
  getJobTitleStats: (country, jobTitle) => api.get('/insights/job_title_salary_stats', { params: { country, job_title: jobTitle } }),
};
