import api from './api';
import { CampusLocation } from '../types';

export const locationService = {
  async getLocations(): Promise<{ success: boolean; locations: CampusLocation[] }> {
    const res = await api.get<{ success: boolean; locations: CampusLocation[] }>('/locations');
    return res.data;
  },

  async createLocation(data: { name: string; description?: string }): Promise<{ success: boolean; location: CampusLocation }> {
    const res = await api.post<{ success: boolean; location: CampusLocation }>('/locations', data);
    return res.data;
  },

  async updateLocation(
    id: string,
    data: { name?: string; description?: string; isActive?: boolean }
  ): Promise<{ success: boolean; location: CampusLocation }> {
    const res = await api.put<{ success: boolean; location: CampusLocation }>(`/locations/${id}`, data);
    return res.data;
  },

  async deleteLocation(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/locations/${id}`);
    return res.data;
  }
};
