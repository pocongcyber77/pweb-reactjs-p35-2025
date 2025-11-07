import axios from 'axios';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
}, (error) => {
	console.error('Request error:', error);
	return Promise.reject(error);
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('Response error:', error);
		// Jika 401 Unauthorized, hapus token dan redirect ke login
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			if (window.location.pathname !== '/auth/login') {
				window.location.href = '/auth/login';
			}
		}
		return Promise.reject(error);
	}
);
