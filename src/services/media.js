import apiFetch from './api.js';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function searchMedia(q, type) {
  const token = localStorage.getItem('token');
  return apiFetch(`${BASE_URL}/api/media/search?q=${q}&type=${type}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getDetailsById(id, type) {
  const token = localStorage.getItem('token');
  return apiFetch(`${BASE_URL}/api/media/info?id=${id}&type=${type}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}
