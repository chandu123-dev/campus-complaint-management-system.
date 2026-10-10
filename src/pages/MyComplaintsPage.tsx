import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { complaintService } from '../services/complaintService';
import { categoryService } from '../services/categoryService';
import { Complaint, Category } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityIndicator } from '../components/common/PriorityIndicator';
import {
  Search,
  Filter,
  PlusCircle,
  ExternalLink,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileQuestion
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MyComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await complaintService.getComplaints({
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        page: currentPage,
        limit: 8
      });

      if (res.success) {
        setComplaints(res.complaints);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
      }
    } catch (err) {
      toast.error('Failed to retrieve complaints list');
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchComplaints();
  };

  const handleDelete = async (id: string, complaintId: string) => {
    if (!window.confirm(`Are you sure you want to withdraw complaint ${complaintId}?`)) {
      return;
    }

    try {
      const res = await complaintService.deleteComplaint(id);
      if (res.success) {
        toast.success(`Complaint ${complaintId} withdrawn successfully`);
        fetchComplaints();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot delete complaint');
    }
  };

  return (
    <DashboardLayout
      title="My Grievance Archive"
      subtitle={`Track the full resolution progress of all ${totalCount} submitted complaints`}
      actions={
        <Link
          to="/student/submit-complaint"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Grievance</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filtering & Search Controls */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ID, keywords, description, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Interactive filter dropdowns */}
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

        {/* Complaints Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          {isLoading ? (
            <div className="p-16 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-300" />
              Loading complaints archive...
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-16 text-center text-slate-500 space-y-3">
              <FileQuestion className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-800">No complaints matching criteria</p>
              <p className="text-xs text-slate-400">
                Try adjusting your search query, filters, or lodge a new complaint.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Complaint ID</th>
                    <th className="py-3 px-4">Title & Description</th>
                    <th className="py-3 px-4">Category & Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Filed Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c) => {
                    const canEditOrDelete = c.status === 'Submitted';
                    return (
                      <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                          {c.complaintId}
                        </td>
                        <td className="py-3.5 px-4 max-w-sm">
                          <Link
                            to={`/student/complaints/${c._id}`}
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
                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500 whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/student/complaints/${c._id}`}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                              title="View timeline and tracking"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            {canEditOrDelete && (
                              <button
                                onClick={() => handleDelete(c._id, c.complaintId)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Withdraw complaint"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination bar */}
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
    </DashboardLayout>
  );
};
