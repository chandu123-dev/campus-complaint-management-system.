import { dbStore } from '../data/store.js';

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, priority, attachmentUrl } = req.body;

    if (!title || !description || !category || !location || !priority) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: title, description, category, location, priority.'
      });
    }

    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Priority must be one of: ${validPriorities.join(', ')}`
      });
    }

    const complaint = dbStore.createComplaint({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      location: location.trim(),
      priority,
      attachmentUrl: attachmentUrl || '',
      student: req.user._id,
      studentName: req.user.name
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating complaint.', error: error.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const { status, priority, category, search, page = 1, limit = 10 } = req.query;

    const filters = {
      status,
      priority,
      category,
      search
    };

    // If regular student, strictly limit to their own complaints
    if (req.user.role === 'student') {
      filters.student = req.user._id;
    }

    const allMatching = dbStore.getComplaints(filters);

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
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
    console.error('Get complaints error:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching complaints.', error: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = dbStore.findComplaintById(id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Authorization check: Students can only view their own complaints
    if (req.user.role === 'student' && complaint.student !== req.user._id) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only view your own complaints.' });
    }

    return res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while fetching complaint details.' });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = dbStore.findComplaintById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Role check: Students can ONLY edit if status is "Submitted"
    if (req.user.role === 'student') {
      if (existing.student !== req.user._id) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      if (existing.status !== 'Submitted') {
        return res.status(400).json({
          success: false,
          message: `Cannot edit complaint once it has been processed (Current status: ${existing.status}).`
        });
      }
    }

    const { title, description, category, location, priority, attachmentUrl } = req.body;
    const updates = {};
    if (title) updates.title = title.trim();
    if (description) updates.description = description.trim();
    if (category) updates.category = category.trim();
    if (location) updates.location = location.trim();
    if (priority) updates.priority = priority;
    if (attachmentUrl !== undefined) updates.attachmentUrl = attachmentUrl;

    const updated = dbStore.updateComplaint(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Complaint updated successfully.',
      complaint: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating complaint.' });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = dbStore.findComplaintById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (req.user.role === 'student') {
      if (existing.student !== req.user._id) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      if (existing.status !== 'Submitted') {
        return res.status(400).json({
          success: false,
          message: `Cannot delete complaint with status '${existing.status}'. Only 'Submitted' complaints can be withdrawn.`
        });
      }
    }

    dbStore.deleteComplaint(id);

    return res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting complaint.' });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, adminComments } = req.body;

    const validStatuses = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Valid status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existing = dbStore.findComplaintById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const previousStatus = existing.status;
    const historyEntry = {
      previousStatus,
      newStatus: status,
      timestamp: new Date().toISOString(),
      updatedBy: req.user.name,
      remarks: remarks || `Status transitioned from ${previousStatus} to ${status}`
    };

    const updates = {
      status,
      statusHistory: [...(existing.statusHistory || []), historyEntry]
    };

    if (adminComments !== undefined) {
      updates.adminComments = adminComments.trim();
    }

    const updated = dbStore.updateComplaint(id, updates);

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}.`,
      complaint: updated
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating complaint status.' });
  }
};
