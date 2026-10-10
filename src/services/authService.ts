import api from './api';
import { User } from '../types';

export interface RegisterPayload {
  name: string;
  studentId: string;
  email: string;
  department: string;
  year: string;
  password: string;
}

export interface LoginPayload {
  identifier: string; // email or student ID
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },

  async updateProfile(data: {
    name?: string;
    department?: string;
    year?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message: string; user: User }> {
    const res = await api.put<{ success: boolean; message: string; user: User }>('/auth/profile', data);
    return res.data;
  },

  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await api.post<{ success: boolean; message: string }>('/seed/reset');
    return res.data;
  }
};
