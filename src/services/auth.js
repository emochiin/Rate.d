import apiFetch from './api.js';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function registerUser(username, email, password) {
  return apiFetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
}

export async function loginUser(username, password) {
  return apiFetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}
