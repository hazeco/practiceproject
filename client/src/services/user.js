import axios from 'axios';

const API = '/api/user';

export const getProfile = async (token) => axios.get(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = async (token, data) => axios.put(`${API}/me`, data, { headers: { Authorization: `Bearer ${token}` } });
