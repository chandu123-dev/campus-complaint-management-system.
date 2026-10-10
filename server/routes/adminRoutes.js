import express from 'express';
import {
  getAdminDashboardStats,
  getAdminStudents,
  getAdminComplaints,
  assignComplaintDepartment,
  resolveComplaint
} from '../controllers/adminController.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Admin-only protection
router.use(authenticate, authorizeRole('admin'));

router.get('/dashboard', getAdminDashboardStats);
router.get('/students', getAdminStudents);
router.get('/complaints', getAdminComplaints);
router.patch('/complaints/:id/assign', assignComplaintDepartment);
router.patch('/complaints/:id/resolve', resolveComplaint);

export default router;
