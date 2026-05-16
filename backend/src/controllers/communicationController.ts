import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// --- MESSAGES ---

export const getMessages = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: String(userId) },
          { receiverId: String(userId) }
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

export const sendMessage = async (req: Request, res: Response) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: { senderId, receiverId, content }
    });
    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

// --- CALENDAR EVENTS ---

export const getEvents = async (req: Request, res: Response) => {
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

export const createEvent = async (req: Request, res: Response) => {
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

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.calendarEvent.delete({ where: { id } });
    return res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete event' });
  }
};
