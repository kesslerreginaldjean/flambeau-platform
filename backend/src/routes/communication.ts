import { Router } from 'express';
import { getMessages, sendMessage, getEvents, createEvent, deleteEvent } from '../controllers/communicationController';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

// Audit P0-4: all communication endpoints require auth.
router.use(verifyToken);

// Messages: any authenticated user can read their own / send (controller filters by req.user).
router.get('/messages', getMessages);
router.post('/messages', sendMessage);

// Calendar
router.get('/events', getEvents);
router.post('/events', requireRole('admin', 'teacher'), createEvent);
router.delete('/events/:id', requireRole('admin'), deleteEvent);

export default router;
