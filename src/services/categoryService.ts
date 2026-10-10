import api from './api';
import { Category } from '../types';

export const categoryService = {
  async getCategories(): Promise<{ success: boolean; categories: Category[] }> {
    const res = await api.get<{ success: boolean; categories: Category[] }>('/categories');
    return res.data;
  },

  async createCategory(data: { name: string; description?: string }): Promise<{ success: boolean; category: Category }> {
    const res = await api.post<{ success: boolean; category: Category }>('/categories', data);
    return res.data;
  },

  async updateCategory(
    id: string,
    data: { name?: string; description?: string; isActive?: boolean }
  ): Promise<{ success: boolean; category: Category }> {
    const res = await api.put<{ success: boolean; category: Category }>(`/categories/${id}`, data);
    return res.data;
  },

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/categories/${id}`);
    return res.data;
  }
};
