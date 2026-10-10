import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { locationService } from '../services/locationService';
import { CampusLocation } from '../types';
import { Plus, Edit2, Trash2, MapPin, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageLocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New location
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Edit location
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editActive, setEditActive] = useState(true);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const res = await locationService.getLocations();
      if (res.success && res.locations) {
        setLocations(res.locations);
      }
    } catch (err) {
      toast.error('Failed to load campus locations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsCreating(true);
    try {
      const res = await locationService.createLocation({
        name: newName,
        description: newDesc
      });
      if (res.success) {
        toast.success(`Location "${newName}" created`);
        setNewName('');
        setNewDesc('');
        fetchLocations();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create location');
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (loc: CampusLocation) => {
    setEditingId(loc._id);
    setEditName(loc.name);
    setEditDesc(loc.description || '');
    setEditActive(loc.isActive);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await locationService.updateLocation(id, {
        name: editName,
        description: editDesc,
        isActive: editActive
      });
      if (res.success) {
        toast.success('Location updated');
        setEditingId(null);
        fetchLocations();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update location');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete location "${name}"?`)) return;

    try {
      const res = await locationService.deleteLocation(id);
      if (res.success) {
        toast.success(`Location "${name}" deleted`);
        fetchLocations();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete location');
    }
  };

  return (
    <DashboardLayout
      title="Campus Locations & Buildings"
      subtitle="Manage university geography, facilities, academic pavilions, and dormitory zones"
    >
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Create Location Form */}
        <div className="lg:col-span-4">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Register New Location
              </h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Facility / Building Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Complex - Floor 3"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Boundaries & Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Lecture halls, wings, room numbers included..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreating ? 'Adding...' : 'Save Campus Location'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Locations List */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Active Campus Locations ({locations.length})
              </h3>
              <button
                onClick={fetchLocations}
                className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {locations.map((loc) => (
                <div key={loc._id} className="p-4 hover:bg-slate-50/60 transition-colors">
                  {editingId === loc._id ? (
                    <div className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-600">Active in form:</label>
                          <input
                            type="checkbox"
                            checked={editActive}
                            onChange={(e) => setEditActive(e.target.checked)}
                            className="rounded"
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description..."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs text-slate-600 border border-slate-200 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(loc._id)}
                          className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">{loc.name}</h4>
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-wider ${
                              loc.isActive ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            {loc.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {loc.description || 'No specific zone notes.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(loc)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(loc._id, loc.name)}
                          className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
