import { api } from './client';

export function setAuthToken(token: string) {
  localStorage.setItem('mealmate_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('mealmate_token');
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return data;
}

export async function getMe(): Promise<{ success: boolean; user: User }> {
  const { data } = await api.get<{ success: boolean; user: User }>('/auth/me');
  return data;
}
