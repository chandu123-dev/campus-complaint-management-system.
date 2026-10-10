// Mongoose schema definition for MongoDB deployment
// Used for MERN stack documentation and MongoDB connections
export const UserSchemaDefinition = {
  name: { type: String, required: true, trim: true },
  studentId: { type: String, required: true, unique: true, uppercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  department: { type: String, required: true, trim: true },
  year: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatarUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
};

export default UserSchemaDefinition;
