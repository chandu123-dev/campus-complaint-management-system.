import api from './api';
import { AdminDashboardStats, Complaint, User } from '../types';

export interface AdminStudentInfo extends User {
  totalComplaints: number;
  activeComplaints: number;
  resolvedComplaints: number;
}

export const adminService = {
  async getDashboardStats(): Promise<{ success: boolean; stats: AdminDashboardStats }> {
    const res = await api.get<{ success: boolean; stats: AdminDashboardStats }>('/admin/dashboard');
    return res.data;
  },

  async getStudents(): Promise<{ success: boolean; students: AdminStudentInfo[] }> {
    const res = await api.get<{ success: boolean; students: AdminStudentInfo[] }>('/admin/students');
    return res.data;
  },

  async getComplaints(params: Record<string, any> = {}): Promise<{
    success: boolean;
    total: number;
    page: number;
    totalPages: number;
    complaints: Complaint[];
  }> {
    const res = await api.get('/admin/complaints', { params });
    return res.data;
  },

  async assignDepartment(
    id: string,
    payload: { assignedDepartment: string; adminComments?: string }
  ): Promise<{ success: boolean; message: string; complaint: Complaint }> {
    const res = await api.patch<{ success: boolean; message: string; complaint: Complaint }>(
      `/admin/complaints/${id}/assign`,
      payload
    );
    return res.data;
  },

  async resolveComplaint(
    id: string,
    payload: { resolutionNotes: string; adminComments?: string; status?: string }
  ): Promise<{ success: boolean; message: string; complaint: Complaint }> {
    const res = await api.patch<{ success: boolean; message: string; complaint: Complaint }>(
      `/admin/complaints/${id}/resolve`,
      payload
    );
    return res.data;
  }
};
