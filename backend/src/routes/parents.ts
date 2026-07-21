import { Router, Request, Response } from 'express';
import { getParentDashboard, getChildDetails } from '../controllers/parentController';
import { verifyToken, requireRole, requireSelfOrRole, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

router.use(verifyToken);

// A parent can only see their own dashboard.
router.get('/:id/dashboard', requireSelfOrRole('id', 'admin'), getParentDashboard);

// Ownership check for child: parent must be linked to the child; admin bypasses.
router.get('/children/:childId', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentification requise.' });
    if (req.user.role === 'admin') return next();
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Accès refusé.' });
    }
    const parent = await prisma.parent.findUnique({ where: { userId: req.user.userId } });
    if (!parent) return res.status(403).json({ message: 'Profil parent introuvable.' });
    const child = await prisma.student.findUnique({ where: { id: req.params.childId } });
    if (!child || child.parentId !== parent.id) {
      return res.status(403).json({ message: 'Cet enfant n’est pas rattaché à votre compte.' });
    }
    return next();
  } catch (err) {
    return res.status(500).json({ error: 'Erreur de vérification d’accès.' });
  }
}, getChildDetails);

router.post('/', requireRole('admin'), (_req: Request, res: Response) => {
  res.json({ message: 'Create parent endpoint' });
});
router.put('/:id', requireRole('admin'), (req: Request, res: Response) => {
  res.json({ message: `Update parent ${req.params.id} endpoint` });
});
router.delete('/:id', requireRole('admin'), (req: Request, res: Response) => {
  res.json({ message: `Delete parent ${req.params.id} endpoint` });
});

export default router;
