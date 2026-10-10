// Mongoose schema definition for MongoDB deployment
export const ComplaintSchemaDefinition = {
  complaintId: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Submitted'
  },
  student: { type: String, required: true, ref: 'User' },
  assignedDepartment: { type: String, default: 'General Administration' },
  attachmentUrl: { type: String, default: '' },
  adminComments: { type: String, default: '' },
  resolutionNotes: { type: String, default: '' },
  statusHistory: [
    {
      previousStatus: { type: String, required: true },
      newStatus: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: String, required: true },
      remarks: { type: String, default: '' }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export default ComplaintSchemaDefinition;
