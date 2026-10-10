import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { complaintService } from '../services/complaintService';
import { adminService } from '../services/adminService';
import { Complaint, ComplaintStatus } from '../types';
import { Timeline } from '../components/common/Timeline';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityIndicator } from '../components/common/PriorityIndicator';
import {
  ArrowLeft,
  Calendar,
  Building2,
  Tag,
  Shield,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Trash2,
  Edit,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin, isStudent } = useAuth();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Admin controls state
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('In Progress');
  const [adminCommentInput, setAdminCommentInput] = useState('');
  const [resolutionNotesInput, setResolutionNotesInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Student edit state (only if Submitted)
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchComplaint = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await complaintService.getComplaintById(id);
      if (res.success && res.complaint) {
        setComplaint(res.complaint);
        setSelectedStatus(res.complaint.status);
        setDepartmentInput(res.complaint.assignedDepartment || '');
        setEditTitle(res.complaint.title);
        setEditDescription(res.complaint.description);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load complaint');
      navigate(isAdmin ? '/admin/complaints' : '/student/complaints');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleAdminStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    setIsUpdating(true);
    try {
      const res = await complaintService.updateStatus(complaint._id, {
        status: selectedStatus,
        remarks: adminCommentInput || `Admin transition to ${selectedStatus}`,
        adminComments: adminCommentInput
      });

      if (res.success) {
        toast.success(`Complaint status changed to ${selectedStatus}`);
        setAdminCommentInput('');
        fetchComplaint();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdminAssignDepartment = async () => {
    if (!complaint || !departmentInput) return;

    setIsUpdating(true);
    try {
      const res = await adminService.assignDepartment(complaint._id, {
        assignedDepartment: departmentInput,
        adminComments: `Assigned to ${departmentInput} team.`
      });

      if (res.success) {
        toast.success(`Department updated to ${departmentInput}`);
        fetchComplaint();
      }
    } catch (err: any) {
      toast.error('Failed to assign department');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdminResolve = async () => {
    if (!complaint || !resolutionNotesInput) {
      toast.error('Please input resolution notes describing the fix');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await adminService.resolveComplaint(complaint._id, {
        resolutionNotes: resolutionNotesInput,
        adminComments: 'Resolution verified and closed by administration.',
        status: 'Resolved'
      });

      if (res.success) {
        toast.success('Complaint officially marked Resolved!');
        setResolutionNotesInput('');
        fetchComplaint();
      }
    } catch (err: any) {
      toast.error('Failed to resolve complaint');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStudentSaveEdit = async () => {
    if (!complaint) return;
    try {
      const res = await complaintService.updateComplaint(complaint._id, {
        title: editTitle,
        description: editDescription
      });
      if (res.success) {
        toast.success('Complaint details updated');
        setIsEditingStudent(false);
        fetchComplaint();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot update complaint');
    }
  };

  const handleStudentDelete = async () => {
    if (!complaint) return;
    if (!window.confirm('Are you sure you wish to withdraw this complaint?')) return;
    try {
      const res = await complaintService.deleteComplaint(complaint._id);
      if (res.success) {
        toast.success('Complaint withdrawn');
        navigate('/student/complaints');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot delete complaint');
    }
  };

  if (isLoading || !complaint) {
    return (
      <DashboardLayout>
        <div className="p-16 text-center text-slate-400 text-xs">
          Loading grievance records and timeline...
        </div>
      </DashboardLayout>
    );
  }

  const canStudentModify = isStudent && complaint.status === 'Submitted';

  return (
    <DashboardLayout
      title={`Complaint ${complaint.complaintId}`}
      subtitle={`Submitted on ${new Date(complaint.createdAt).toLocaleDateString()} · ${complaint.category}`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to={isAdmin ? '/admin/complaints' : '/student/complaints'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Queue</span>
          </Link>

          {canStudentModify && (
            <>
              <button
                onClick={() => setIsEditingStudent(!isEditingStudent)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{isEditingStudent ? 'Cancel Edit' : 'Edit'}</span>
              </button>
              <button
                onClick={handleStudentDelete}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Withdraw</span>
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Complaint Details & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Card */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {complaint.complaintId}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <StatusBadge status={complaint.status} />
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <PriorityIndicator priority={complaint.priority} />
                </div>
              </div>

              <div className="text-right text-xs text-slate-500">
                <span className="block font-medium text-slate-700">Assigned Department</span>
                <span className="text-blue-700 font-semibold">{complaint.assignedDepartment}</span>
              </div>
            </div>

            {/* Editable or Static Title & Description */}
            {isEditingStudent ? (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={handleStudentSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{complaint.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>
            )}

            {/* Meta tags list - Zero-Pill Discipline with typographic separators */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Category: <strong className="text-slate-700 font-medium ml-1">{complaint.category}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Location: <strong className="text-slate-700 font-medium ml-1">{complaint.location}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Logged: <strong className="font-mono tabular-nums text-slate-700 ml-1">{new Date(complaint.createdAt).toLocaleDateString()}</strong>
              </span>
            </div>

            {/* Optional Evidence Attachment */}
            {complaint.attachmentUrl && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Uploaded Facility Attachment
                </h4>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-w-md bg-slate-50">
                  <img
                    src={complaint.attachmentUrl}
                    alt="Facility grievance evidence"
                    className="w-full h-56 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            {/* Official Administrative Comments & Resolution Notes */}
            {(complaint.adminComments || complaint.resolutionNotes) && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {complaint.adminComments && (
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Official Administrative Comment</span>
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      {complaint.adminComments}
                    </p>
                  </div>
                )}

                {complaint.resolutionNotes && (
                  <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Resolution Sign-Off Details</span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      {complaint.resolutionNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Visual Lifecycle Timeline */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Status Progression & Timeline History
            </h3>
            <Timeline
              currentStatus={complaint.status}
              history={complaint.statusHistory || []}
              createdAt={complaint.createdAt}
            />
          </div>
        </div>

        {/* Right Column: Student Info & Admin Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Complainant Student Info Card */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                {complaint.studentDetails?.name ? (
                  <img
                    src="/src/assets/images/avatar_student_default_1791611356199.jpg"
                    alt="Student avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {complaint.studentDetails?.name || 'Verified Student'}
                </h4>
                <p className="text-xs text-slate-500 font-mono tabular-nums">
                  ID: {complaint.studentDetails?.studentId || 'N/A'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-medium text-slate-800 text-right">{complaint.studentDetails?.department || 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Class Year:</span>
                <span className="font-medium text-slate-800">{complaint.studentDetails?.year || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact Email:</span>
                <span className="font-medium text-slate-800">{complaint.studentDetails?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Admin Workflow Management Panel */}
          {isAdmin && (
            <div className="p-6 bg-amber-50/50 border border-amber-200/80 rounded-2xl shadow-xs space-y-5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-amber-950">
                  Administrative Control Panel
                </h3>
              </div>

              {/* 1. Status Transition Form */}
              <form onSubmit={handleAdminStatusChange} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Update Complaint Status
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Acknowledged">Acknowledged</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Set Status
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Optional admin comment for timeline..."
                  value={adminCommentInput}
                  onChange={(e) => setAdminCommentInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>

              {/* 2. Assign Department */}
              <div className="pt-3 border-t border-amber-200/60 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Assign Staff or Department
                </label>
                <div className="flex gap-2">
                  <select
                    value={departmentInput}
                    onChange={(e) => setDepartmentInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
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
                  <button
                    type="button"
                    onClick={handleAdminAssignDepartment}
                    disabled={isUpdating}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Assign
                  </button>
                </div>
              </div>

              {/* 3. Official Resolution Sign-Off */}
              {complaint.status !== 'Resolved' && (
                <div className="pt-3 border-t border-amber-200/60 space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Document Official Resolution
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter resolution notes (e.g., Replacement parts fitted, tested on Oct 5 by supervisor)..."
                    value={resolutionNotesInput}
                    onChange={(e) => setResolutionNotesInput(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAdminResolve}
                    disabled={isUpdating}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Confirm & Mark as Resolved</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
