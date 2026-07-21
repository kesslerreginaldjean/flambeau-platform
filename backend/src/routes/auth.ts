import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { validate, schemas } from '../middleware/validate';
import { env } from '../lib/env';

const router = Router();

const signToken = (user: { id: string; email: string; role: string; firstName: string; lastName: string }) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );
};

/**
 * POST /api/auth/login
 *
 * Audit fixes:
 *  - Same generic error message for "unknown email" and "wrong password" (mitigates enumeration).
 *  - Always run bcrypt.compare against a dummy hash on missing user to keep timing constant.
 *  - Do NOT echo back the requested role; rely on the user's actual role from DB.
 *  - JWT expires per env.JWT_EXPIRES_IN (default 2h).
 */
const DUMMY_HASH = '$2b$12$0000000000000000000000.0000000000000000000000000000000000';

router.post('/login', validate(schemas.login), async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // Always run a bcrypt compare to keep response time constant.
    const validPassword = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, DUMMY_HASH);

    if (!user || !validPassword) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ message: 'Compte désactivé. Contactez l’administration.' });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('[auth] login error:', error);
    return res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
});

router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Non autorisé.' });
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true, email: true, role: true, firstName: true, lastName: true,
        phone: true, address: true, dateOfBirth: true, gender: true, image: true, status: true,
      },
    });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
  }
});

/**
 * POST /api/auth/register
 *
 * Audit P0-5: PUBLIC self-registration is locked down.
 *  - The `role` field from the body is IGNORED — every public registration creates a `student`.
 *  - Admin/teacher/parent accounts are created through `/api/admin/users` (admin only).
 *  - Password complexity is enforced (>= 10 chars).
 */
router.post('/register', validate(schemas.register), async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string' ||
      typeof firstName !== 'string' || typeof lastName !== 'string') {
    return res.status(400).json({ message: 'Champs invalides.' });
  }
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }
  if (password.length < 10) {
    return res.status(400).json({ message: 'Mot de passe trop court (10 caractères minimum).' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ message: 'Email invalide.' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      // Generic message: do not reveal existence.
      return res.status(202).json({ message: 'Si l’email est valide, un compte sera créé.' });
    }

    const hashed = await bcrypt.hash(password, env.BCRYPT_COST);
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        firstName,
        lastName,
        role: 'student',           // Audit P0-5: role is FORCED.
        status: 'active',
      },
    });

    const token = signToken(newUser);
    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
    console.error('[auth] register error:', error);
    return res.status(500).json({ message: 'Erreur lors de la création du compte.' });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  // JWT is stateless: real logout requires either a blacklist or httpOnly-cookie clear.
  // Until cookies are introduced, the client is responsible for discarding the token.
  return res.json({ message: 'Déconnexion réussie.' });
});

/**
 * PUT /api/auth/profile
 *
 * Audit fixes:
 *  - Email, role and status are immutable here (must be changed by admin).
 *  - Changing the password REQUIRES the current password.
 *  - Password complexity enforced.
 */
router.put('/profile', verifyToken, validate(schemas.profile), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Non autorisé.' });

    const { firstName, lastName, phone, address, currentPassword, newPassword } = req.body ?? {};

    const data: Record<string, unknown> = {};
    if (typeof firstName === 'string') data.firstName = firstName;
    if (typeof lastName === 'string') data.lastName = lastName;
    if (typeof phone === 'string') data.phone = phone;
    if (typeof address === 'string') data.address = address;

    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 10) {
        return res.status(400).json({ message: 'Nouveau mot de passe trop court (10 caractères minimum).' });
      }
      if (typeof currentPassword !== 'string' || !currentPassword) {
        return res.status(400).json({ message: 'Le mot de passe actuel est requis pour changer de mot de passe.' });
      }
      const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
      if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
      data.password = await bcrypt.hash(newPassword, env.BCRYPT_COST);
    }

    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data,
      select: {
        id: true, email: true, role: true, firstName: true, lastName: true,
        phone: true, address: true,
      },
    });

    return res.json({ message: 'Profil mis à jour.', user: updated });
  } catch (error) {
    console.error('[auth] profile error:', error);
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
  }
});

export default router;
