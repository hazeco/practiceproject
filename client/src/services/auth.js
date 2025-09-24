import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth";

export const register = async (data) => axios.post(`${API_URL}/register`, data);
export const login = async (data) => axios.post(`${API_URL}/login`, data);
// export const verifyEmail = async (token) => axios.post(`${API_URL}/verify-email`, { token });
export const refreshToken = async (refreshToken) => axios.post(`${API_URL}/refresh-token`, { refreshToken });
export const socialLogin = async (provider, socialId, email, username, avatar) =>
  axios.post(`${API_URL}/social-login`, { provider, socialId, email, username, avatar });
