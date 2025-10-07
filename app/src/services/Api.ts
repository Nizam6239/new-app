import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/auth/api',
});

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const register = (data: RegisterPayload) =>
  API.post('/auth/register', data);
export const login = (data: LoginPayload) => API.post('/auth/login', data);
