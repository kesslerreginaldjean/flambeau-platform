import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

const jwtSecret = process.env.JWT_SECRET || 'dev-secret';

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ message: 'Jeton d’authentification manquant.' });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as AuthRequest['user'];
    req.user = payload;
    next();
    return;
  } catch (error) {
    res.status(401).json({ message: 'Jeton invalide ou expiré.' });
    return;
  }
};
