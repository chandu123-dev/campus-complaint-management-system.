import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { adminService } from '../services/adminService';
import { categoryService } from '../services/categoryService';
import { Complaint, Category, ComplaintStatus } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityIndicator } from '../components/common/PriorityIndicator';
import {
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  X,
  MessageSquare,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Quick Status/Assign Modal state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalStatus, setModalStatus] = useState<ComplaintStatus>('In Progress');
  const [modalDepartment, setModalDepartment] = useState('');
  const [modalRemarks, setModalRemarks] = useState('');
  const [modalResolutionNotes, setModalResolutionNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getComplaints({
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        page: currentPage,
        limit: 10
      });

      if (res.success) {
        setComplaints(res.complaints);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
      }
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res.success) setCategories(res.categories);
    });
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter, categoryFilter, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchComplaints();
  };

  const openQuickUpdate = (c: Complaint) => {
    setSelectedComplaint(c);
    setModalStatus(c.status);
    setModalDepartment(c.assignedDepartment || 'General Administration');
    setModalRemarks('');
    setModalResolutionNotes(c.resolutionNotes || '');
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    try {
      // 1. Assign department if changed
      if (modalDepartment !== selectedComplaint.assignedDepartment) {
        await adminService.assignDepartment(selectedComplaint._id, {
          assignedDepartment: modalDepartment,
          adminComments: modalRemarks || `Assigned to ${modalDepartment}`
        });
      }

      // 2. If status is resolved and notes provided
      if (modalStatus === 'Resolved' && modalResolutionNotes) {
        await adminService.resolveComplaint(selectedComplaint._id, {
          resolutionNotes: modalResolutionNotes,
          adminComments: modalRemarks,
          status: 'Resolved'
        });
      } else {
        // Status transition
        const { default: api } = await import('../services/api');
        await api.patch(`/complaints/${selectedComplaint._id}/status`, {
          status: modalStatus,
          remarks: modalRemarks || `Status changed to ${modalStatus}`,
          adminComments: modalRemarks
        });
      }

      toast.success(`Complaint ${selectedComplaint.complaintId} updated successfully`);
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update complaint');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout
      title="All Campus Grievances"
      subtitle={`Complete institutional registry of all ${totalCount} student submissions`}
      actions={
        <button
          onClick={fetchComplaints}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Filter Toolbar */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ID, keyword, student name, student ID, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Filter Records
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setPriorityFilter('All');
                  setCategoryFilter('All');
                  setCurrentPage(1);
                }}
                className="w-full py-1.5 px-3 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Data Grid */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Student & Contact</th>
                  <th className="py-3 px-4">Complaint Title</th>
                  <th className="py-3 px-4">Category & Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Dept</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-300" />
                      Loading complaints...
                    </td>
                  </tr>
                ) : complaints.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No complaints matched the criteria.
                    </td>
                  </tr>
                ) : (
                  complaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                        {c.complaintId}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {c.studentDetails?.name || 'Student'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {c.studentDetails?.studentId || ''} · {c.studentDetails?.department || ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link
                          to={`/admin/complaints/${c._id}`}
                          className="font-medium text-slate-900 hover:text-blue-600 line-clamp-1"
                        >
                          {c.title}
                        </Link>
                        <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                          {c.description}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{c.category}</div>
                        <div className="text-[11px] text-slate-400">{c.location}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityIndicator priority={c.priority} />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium text-xs">
                        {c.assignedDepartment}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openQuickUpdate(c)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                          >
                            Triage
                          </button>
                          <Link
                            to={`/admin/complaints/${c._id}`}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded transition-colors"
                            title="Full Details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono tabular-nums">
                Page {currentPage} of {totalPages} ({totalCount} total)
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded bg-white disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded bg-white disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Triage / Status Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Quick Triage: {selectedComplaint.complaintId}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedComplaint.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Change Status
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Department
                </label>
                <select
                  value={modalDepartment}
                  onChange={(e) => setModalDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="General Administration">General Administration</option>
                  <option value="Campus Electrical Works">Campus Electrical Works</option>
                  <option value="Facilities & Sanitation">Facilities & Sanitation</option>
                  <option value="IT Network Operations">IT Network Operations</option>
                  <option value="Hostel Wardens & Maintenance">Hostel Wardens & Maintenance</option>
                  <option value="Security & Transport Logistics">Security & Transport Logistics</option>
                  <option value="Library Administration">Library Administration</option>
                  <option value="Laboratory Safety Division">Laboratory Safety Division</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrative Note / Timeline Remark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electrician scheduled for 2 PM..."
                  value={modalRemarks}
                  onChange={(e) => setModalRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              {modalStatus === 'Resolved' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Resolution Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe how the problem was resolved..."
                    value={modalResolutionNotes}
                    onChange={(e) => setModalResolutionNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Apply Triage Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
