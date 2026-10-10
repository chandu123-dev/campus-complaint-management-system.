import express from 'express';
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
} from '../controllers/locationController.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getLocations);
router.post('/', authenticate, authorizeRole('admin'), createLocation);
router.put('/:id', authenticate, authorizeRole('admin'), updateLocation);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteLocation);

export default router;
