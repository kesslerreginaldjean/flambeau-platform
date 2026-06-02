import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

// --- MESSAGES ---

export const getMessages = async (req: AuthRequest, res: Response) => {
  // Audit fix: ignore client-supplied userId, always derive from JWT.
  if (!req.user) return res.status(401).json({ message: 'Authentification requise.' });
  const userId = req.user.userId;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: { select: { firstName: true, lastName: true, role: true } },
        receiver: { select: { firstName: true, lastName: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Authentification requise.' });
  const { receiverId, content } = req.body;
  if (!receiverId || !content || typeof content !== 'string') {
    return res.status(400).json({ message: 'receiverId et content requis.' });
  }
  if (content.length > 5000) return res.status(400).json({ message: 'Message trop long.' });
  try {
    // Sender is always the authenticated user — never trust req.body.senderId.
    const message = await prisma.message.create({
      data: { senderId: req.user.userId, receiverId, content }
    });
    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

// --- CALENDAR EVENTS ---

export const getEvents = async (req: AuthRequest, res: Response) => {
  const { target } = req.query;
  try {
    const events = await prisma.calendarEvent.findMany({
      where: target ? { 
        OR: [
          { target: String(target) },
          { target: 'all' }
        ]
      } : {},
      orderBy: { startDate: 'asc' }
    });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  const { title, description, startDate, endDate, location, type, target } = req.body;
  try {
    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        type,
        target: target || 'all'
      }
    });
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create event' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.calendarEvent.delete({ where: { id } });
    return res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete event' });
  }
};
