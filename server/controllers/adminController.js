import { dbStore } from '../data/store.js';

export const getAdminDashboardStats = async (req, res) => {
  try {
    const allComplaints = dbStore.getComplaints({});
    const allUsers = dbStore.collection('users');
    const students = allUsers.filter(u => u.role === 'student');

    const totalComplaints = allComplaints.length;
    const submittedComplaints = allComplaints.filter(c => c.status === 'Submitted').length;
    const acknowledgedComplaints = allComplaints.filter(c => c.status === 'Acknowledged').length;
    const inProgressComplaints = allComplaints.filter(c => c.status === 'In Progress').length;
    const resolvedComplaints = allComplaints.filter(c => c.status === 'Resolved').length;
    const rejectedComplaints = allComplaints.filter(c => c.status === 'Rejected').length;
    const pendingComplaints = submittedComplaints + acknowledgedComplaints;

    // By Category aggregation
    const categoryCountMap = {};
    const categories = dbStore.getCategories();
    categories.forEach(cat => { categoryCountMap[cat.name] = 0; });
    allComplaints.forEach(c => {
      categoryCountMap[c.category] = (categoryCountMap[c.category] || 0) + 1;
    });
    const complaintsByCategory = Object.keys(categoryCountMap).map(category => ({
      category,
      count: categoryCountMap[category]
    })).sort((a, b) => b.count - a.count);

    // By Status aggregation
    const complaintsByStatus = [
      { status: 'Submitted', count: submittedComplaints, fill: '#3b82f6' },
      { status: 'Acknowledged', count: acknowledgedComplaints, fill: '#6366f1' },
      { status: 'In Progress', count: inProgressComplaints, fill: '#f59e0b' },
      { status: 'Resolved', count: resolvedComplaints, fill: '#10b981' },
      { status: 'Rejected', count: rejectedComplaints, fill: '#ef4444' }
    ];

    // By Priority aggregation
    const priorityCountMap = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    allComplaints.forEach(c => {
      if (priorityCountMap[c.priority] !== undefined) {
        priorityCountMap[c.priority] += 1;
      }
    });
    const complaintsByPriority = [
      { priority: 'Urgent', count: priorityCountMap.Urgent, color: '#dc2626' },
      { priority: 'High', count: priorityCountMap.High, color: '#f97316' },
      { priority: 'Medium', count: priorityCountMap.Medium, color: '#eab308' },
      { priority: 'Low', count: priorityCountMap.Low, color: '#10b981' }
    ];

    // High Priority active complaints queue
    const highPriorityComplaints = allComplaints.filter(
      c => (c.priority === 'Urgent' || c.priority === 'High') && c.status !== 'Resolved' && c.status !== 'Rejected'
    ).slice(0, 5);

    // Recent 5 complaints
    const recentComplaints = allComplaints.slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
        totalStudents: students.length,
        resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0,
        complaintsByCategory,
        complaintsByStatus,
        complaintsByPriority,
        recentComplaints,
        highPriorityComplaints
      }
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Error compiling dashboard statistics.' });
  }
};

export const getAdminStudents = async (req, res) => {
  try {
    const allUsers = dbStore.collection('users');
    const allComplaints = dbStore.collection('complaints');

    const students = allUsers
      .filter(u => u.role === 'student')
      .map(u => {
        const studentComplaints = allComplaints.filter(c => c.student === u._id);
        const resolvedCount = studentComplaints.filter(c => c.status === 'Resolved').length;
        const activeCount = studentComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length;

        return {
          _id: u._id,
          name: u.name,
          studentId: u.studentId,
          email: u.email,
          department: u.department,
          year: u.year,
          createdAt: u.createdAt,
          totalComplaints: studentComplaints.length,
          activeComplaints: activeCount,
          resolvedComplaints: resolvedCount
        };
      });

    return res.status(200).json({
      success: true,
      students
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving students.' });
  }
};

export const getAdminComplaints = async (req, res) => {
  try {
    const { status, priority, category, search, page = 1, limit = 20 } = req.query;

    const allMatching = dbStore.getComplaints({ status, priority, category, search });

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = allMatching.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      total: allMatching.length,
      page: pageNum,
      totalPages: Math.ceil(allMatching.length / limitNum) || 1,
      complaints: paginated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving complaints list.' });
  }
};

export const assignComplaintDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedDepartment, adminComments } = req.body;

    if (!assignedDepartment) {
      return res.status(400).json({ success: false, message: 'assignedDepartment is required.' });
    }

    const complaint = dbStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const historyEntry = {
      previousStatus: complaint.status,
      newStatus: complaint.status,
      timestamp: new Date().toISOString(),
      updatedBy: req.user.name,
      remarks: `Assigned to department: ${assignedDepartment}`
    };

    const updates = {
      assignedDepartment: assignedDepartment.trim(),
      statusHistory: [...(complaint.statusHistory || []), historyEntry]
    };

    if (adminComments) {
      updates.adminComments = adminComments.trim();
    }

    const updated = dbStore.updateComplaint(id, updates);

    return res.status(200).json({
      success: true,
      message: `Assigned to ${assignedDepartment}.`,
      complaint: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error assigning complaint department.' });
  }
};

export const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes, adminComments, status = 'Resolved' } = req.body;

    if (!resolutionNotes) {
      return res.status(400).json({ success: false, message: 'Resolution notes are required when closing a complaint.' });
    }

    const complaint = dbStore.findComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const historyEntry = {
      previousStatus: complaint.status,
      newStatus: status,
      timestamp: new Date().toISOString(),
      updatedBy: req.user.name,
      remarks: `Resolution documented: ${resolutionNotes.substring(0, 100)}`
    };

    const updates = {
      status,
      resolutionNotes: resolutionNotes.trim(),
      statusHistory: [...(complaint.statusHistory || []), historyEntry]
    };

    if (adminComments) {
      updates.adminComments = adminComments.trim();
    }

    const updated = dbStore.updateComplaint(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Complaint resolved and documented successfully.',
      complaint: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error resolving complaint.' });
  }
};
