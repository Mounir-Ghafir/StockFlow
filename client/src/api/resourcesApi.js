import api from './axios';

const unwrap = (response) => response.data;

export const productsApi = {
  list: (params = {}) => api.get('/products', { params }).then(unwrap),
  get: (id) => api.get(`/products/${id}`).then(unwrap),
  create: (payload) => api.post('/products', payload).then(unwrap),
  update: (id, payload) => api.put(`/products/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/products/${id}`),
};

const resourceApi = (path) => ({
  list: () => api.get(path).then(unwrap),
  create: (payload) => api.post(path, payload).then(unwrap),
  update: (id, payload) => api.put(`${path}/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`${path}/${id}`),
});

export const categoriesApi = resourceApi('/categories');
export const suppliersApi = resourceApi('/suppliers');

export const salesApi = {
  list: () => api.get('/sales').then(unwrap),
  create: (payload) => api.post('/sales', payload).then(unwrap),
};

export const dashboardApi = {
  summary: () => api.get('/dashboard/summary').then(unwrap),
};

export const purchaseOrdersApi = {
  list: () => api.get('/purchase-orders').then(unwrap),
  create: (payload) => api.post('/purchase-orders', payload).then(unwrap),
  receive: (id) => api.post(`/purchase-orders/${id}/receive`).then(unwrap),
  remove: (id) => api.delete(`/purchase-orders/${id}`),
};
