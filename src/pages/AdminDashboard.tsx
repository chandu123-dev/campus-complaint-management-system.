import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { adminService } from '../services/adminService';
import { AdminDashboardStats, Complaint } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityIndicator } from '../components/common/PriorityIndicator';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      toast.error('Failed to load administrative analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const STATUS_COLORS: Record<string, string> = {
    Submitted: '#3b82f6',
    Acknowledged: '#6366f1',
    'In Progress': '#f59e0b',
    Resolved: '#10b981',
    Rejected: '#ef4444'
  };

  return (
    <DashboardLayout
      title="Administrative Command Center"
      subtitle="Real-time campus resolution metrics, workload analytics, and incident triage queue"
      actions={
        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards - 6 Cards Grid calculated from MongoDB */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Logged
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {stats?.totalComplaints ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Campus grievances</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Pending Triage
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-blue-600">
              {stats?.pendingComplaints ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">New or Acknowledged</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              In Progress
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-600">
              {stats?.inProgressComplaints ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Staff dispatched</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Resolved
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {stats?.resolvedComplaints ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Sign-off complete</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Rejected
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-rose-600">
              {stats?.rejectedComplaints ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Closed/Ineligible</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Active Students
            </span>
            <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600">
              {stats?.totalStudents ?? 0}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Verified profiles</span>
          </div>
        </div>

        {/* Charts Section: By Category & By Status */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Chart 1: Bar Chart of Complaints by Category */}
          <div className="lg:col-span-7 p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Complaints by Category
                </h3>
              </div>
              <span className="text-xs text-slate-400">Department distribution</span>
            </div>

            <div className="h-64 w-full">
              {stats?.complaintsByCategory && stats.complaintsByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.complaintsByCategory.slice(0, 7)}
                    margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                  >
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      angle={-20}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No data available yet
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Donut / Pie Chart of Complaints by Status */}
          <div className="lg:col-span-5 p-5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Status Distribution
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Resolution Rate: <strong>{stats?.resolutionRate ?? 0}%</strong>
              </span>
            </div>

            <div className="h-64 w-full">
              {stats?.complaintsByStatus && stats.complaintsByStatus.some((s) => s.count > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.complaintsByStatus.filter((s) => s.count > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="status"
                    >
                      {stats.complaintsByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.status] || '#94a3b8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No status distribution records
                </div>
              )}
            </div>
          </div>
        </div>

        {/* High Priority Emergency Queue */}
        <div className="p-5 bg-red-50/50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-red-950">
                Urgent & High-Priority Queue
              </h3>
            </div>
            <span className="text-xs text-red-600 font-medium">Requires Immediate Triage</span>
          </div>

          {stats?.highPriorityComplaints && stats.highPriorityComplaints.length > 0 ? (
            <div className="space-y-2">
              {stats.highPriorityComplaints.map((c) => (
                <div
                  key={c._id}
                  className="p-3 bg-white border border-red-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-red-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono tabular-nums font-bold text-slate-900">
                        {c.complaintId}
                      </span>
                      <span aria-hidden="true">·</span>
                      <PriorityIndicator priority={c.priority} />
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500">{c.location}</span>
                    </div>
                    <Link
                      to={`/admin/complaints/${c._id}`}
                      className="font-semibold text-slate-900 hover:text-blue-600 text-sm line-clamp-1"
                    >
                      {c.title}
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={c.status} />
                    <Link
                      to={`/admin/complaints/${c._id}`}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Resolve
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No unresolved urgent hazards at this time. All high-priority items resolved!
            </p>
          )}
        </div>

        {/* Recent Complaints Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Latest Submissions Across Campus
            </h3>
            <Link
              to="/admin/complaints"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>Manage all complaints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Dept</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentComplaints && stats.recentComplaints.length > 0 ? (
                  stats.recentComplaints.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                        {c.complaintId}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {c.studentDetails?.name || 'Student'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {c.studentDetails?.studentId || ''}
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <Link
                          to={`/admin/complaints/${c._id}`}
                          className="font-medium text-slate-900 hover:text-blue-600 line-clamp-1"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{c.category}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <PriorityIndicator priority={c.priority} />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-medium text-xs">
                        {c.assignedDepartment}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/complaints/${c._id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <span>Manage</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No complaints logged yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
