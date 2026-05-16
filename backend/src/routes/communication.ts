import { Router } from 'express';
import { getMessages, sendMessage, getEvents, createEvent, deleteEvent } from '../controllers/communicationController';

const router = Router();

// Messagerie
router.get('/messages', getMessages);
router.post('/messages', sendMessage);

// Agenda / Calendrier
router.get('/events', getEvents);
router.post('/events', createEvent);
router.delete('/events/:id', deleteEvent);

export default router;
