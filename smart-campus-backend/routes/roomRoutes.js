import express from 'express';
import { 
  updateRoomStatus, 
  getAllRooms, 
  getRoomDetails 
} from '../controllers/roomController.js';

const router = express.Router();

// 🟢 PUBLIC ROUTES

// Get all rooms (for Dashboard)
router.get('/', getAllRooms);

// Get specific room details + schedule
router.get('/:id', getRoomDetails);

// 🔒 INTERNAL ROUTE (Used by Python AI)
// In a real app, you might add middleware like 'verifyAPIKey' here
router.post('/update', updateRoomStatus);

export default router;