import { Router, Request, Response } from 'express';
import { getStudentDashboard, getStudentGrades, getStudentPayments } from '../controllers/studentController';

const router = Router();

router.get('/:id/dashboard', getStudentDashboard);
router.get('/:id/grades', getStudentGrades);
router.get('/:id/payments', getStudentPayments);

router.post('/', (_req: Request, res: Response) => {
  res.json({ message: 'Create student endpoint' });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: `Update student ${req.params.id} endpoint` });
});

router.delete('/:id', (req: Request, res: Response) => {
  res.json({ message: `Delete student ${req.params.id} endpoint` });
});

export default router;