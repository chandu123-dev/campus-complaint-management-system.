export type UserRole = 'student' | 'admin';

export interface User {
  _id: string;
  name: string;
  studentId: string;
  email: string;
  department: string;
  year: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type ComplaintStatus = 'Submitted' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Rejected';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface StatusHistoryItem {
  previousStatus: string;
  newStatus: ComplaintStatus;
  timestamp: string;
  updatedBy: string;
  remarks?: string;
}

export interface Complaint {
  _id: string;
  complaintId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  student: string;
  studentDetails?: {
    _id: string;
    name: string;
    studentId: string;
    email: string;
    department: string;
    year: string;
  } | null;
  assignedDepartment: string;
  attachmentUrl?: string;
  adminComments?: string;
  resolutionNotes?: string;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CampusLocation {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface AdminDashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  rejectedComplaints: number;
  totalStudents: number;
  resolutionRate: number;
  complaintsByCategory: { category: string; count: number }[];
  complaintsByStatus: { status: string; count: number; fill: string }[];
  complaintsByPriority: { priority: string; count: number; color: string }[];
  recentComplaints: Complaint[];
  highPriorityComplaints: Complaint[];
}

export interface StudentDashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  rejectedComplaints: number;
}
