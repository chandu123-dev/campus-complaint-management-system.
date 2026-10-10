import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticate, authorizeRole('admin'), createCategory);
router.put('/:id', authenticate, authorizeRole('admin'), updateCategory);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteCategory);

export default router;
