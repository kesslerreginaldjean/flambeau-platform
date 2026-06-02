import { Router, Request, Response } from 'express';
import {
  getTeacherDashboard, getTeacherClasses, getClassStudents, submitAttendance, submitGrades,
} from '../controllers/teacherController';
import { verifyToken, requireRole, requireSelfOrRole } from '../middleware/auth';

const router = Router();

router.use(verifyToken);

router.get('/:id/dashboard', requireSelfOrRole('id', 'admin'), getTeacherDashboard);
router.get('/:id/classes', requireSelfOrRole('id', 'admin'), getTeacherClasses);
router.get('/classes/:classId/students', requireRole('teacher', 'admin'), getClassStudents);
router.post('/attendance', requireRole('teacher', 'admin'), submitAttendance);
router.post('/grades', requireRole('teacher', 'admin'), submitGrades);

router.post('/', requireRole('admin'), (_req: Request, res: Response) => {
  res.json({ message: 'Create teacher endpoint' });
});
router.put('/:id', requireRole('admin'), (req: Request, res: Response) => {
  res.json({ message: `Update teacher ${req.params.id} endpoint` });
});
router.delete('/:id', requireRole('admin'), (req: Request, res: Response) => {
  res.json({ message: `Delete teacher ${req.params.id} endpoint` });
});

export default router;
