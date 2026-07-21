import { Router, Request, Response } from 'express';
import { getStudentDashboard, getStudentGrades, getStudentPayments } from '../controllers/studentController';
import { verifyToken, requireRole, requireSelfOrRole } from '../middleware/auth';

const router = Router();

// Audit P0-4: all student endpoints require JWT.
router.use(verifyToken);

// IDOR fix: a student can only read their OWN data; admin can read anyone.
router.get('/:id/dashboard', requireSelfOrRole('id', 'admin', 'teacher', 'parent'), getStudentDashboard);
router.get('/:id/grades', requireSelfOrRole('id', 'admin', 'teacher', 'parent'), getStudentGrades);
router.get('/:id/payments', requireSelfOrRole('id', 'admin', 'parent'), getStudentPayments);

router.post('/', requireRole('admin'), (_req: Request, res: Response) => {
  res.json({ message: 'Create student endpoint' });
});
router.put('/:id', requireRole('admin'), (req: Request, res: Response) => {
  res.json({ message: `Update student ${req.params.id} endpoint` });
});
router.delete('/:id', requireRole('admin'), (req: Request, res: Response) => {
  res.json({ message: `Delete student ${req.params.id} endpoint` });
});

export default router;
