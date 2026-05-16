import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();
const jwtSecret = process.env.JWT_SECRET || 'dev-secret';

const signToken = (user: any) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    jwtSecret,
    { expiresIn: '8h' }
  );
};

router.post('/login', async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, mot de passe et rôle sont requis.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || user.role !== role) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const token = signToken(user);
    return res.json({ 
      token, 
      user: { 
        id: user.id,
        email: user.email, 
        role: user.role, 
        firstName: user.firstName, 
        lastName: user.lastName 
      } 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
});

router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, role, firstName, lastName } = req.body;
  if (!email || !password || !role || !firstName || !lastName) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        firstName,
        lastName,
        role,
        status: 'active'
      }
    });

    const token = signToken(newUser);
    return res.status(201).json({ 
      token, 
      user: { 
        id: newUser.id,
        email, 
        role, 
        firstName, 
        lastName 
      } 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la création du compte.' });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  return res.json({ message: 'Déconnexion réussie.' });
});

router.put('/profile', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Non autorisé.' });
    
    const { firstName, lastName, phone, address, password } = req.body;
    const data: any = { firstName, lastName, phone, address };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data
    });

    return res.json({ 
      message: 'Profil mis à jour avec succès.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
  }
});

export default router;
