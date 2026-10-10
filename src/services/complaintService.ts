import api from './api';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../types';

export interface CreateComplaintPayload {
  title: string;
  description: string;
  category: string;
  location: string;
  priority: ComplaintPriority;
  attachmentUrl?: string;
}

export interface ComplaintsQuery {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedComplaintsResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  complaints: Complaint[];
}

export const complaintService = {
  async getComplaints(params: ComplaintsQuery = {}): Promise<PaginatedComplaintsResponse> {
    const res = await api.get<PaginatedComplaintsResponse>('/complaints', { params });
    return res.data;
  },

  async getComplaintById(id: string): Promise<{ success: boolean; complaint: Complaint }> {
    const res = await api.get<{ success: boolean; complaint: Complaint }>(`/complaints/${id}`);
    return res.data;
  },

  async createComplaint(data: CreateComplaintPayload): Promise<{ success: boolean; message: string; complaint: Complaint }> {
    const res = await api.post<{ success: boolean; message: string; complaint: Complaint }>('/complaints', data);
    return res.data;
  },

  async updateComplaint(
    id: string,
    data: Partial<CreateComplaintPayload>
  ): Promise<{ success: boolean; message: string; complaint: Complaint }> {
    const res = await api.put<{ success: boolean; message: string; complaint: Complaint }>(`/complaints/${id}`, data);
    return res.data;
  },

  async deleteComplaint(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/complaints/${id}`);
    return res.data;
  },

  async updateStatus(
    id: string,
    payload: { status: ComplaintStatus; remarks?: string; adminComments?: string }
  ): Promise<{ success: boolean; message: string; complaint: Complaint }> {
    const res = await api.patch<{ success: boolean; message: string; complaint: Complaint }>(`/complaints/${id}/status`, payload);
    return res.data;
  }
};
