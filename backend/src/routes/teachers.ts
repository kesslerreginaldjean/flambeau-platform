import { Router, Request, Response } from 'express';
import { 
  getTeacherDashboard, getTeacherClasses, getClassStudents, submitAttendance, submitGrades 
} from '../controllers/teacherController';

const router = Router();

router.get('/:id/dashboard', getTeacherDashboard);
router.get('/:id/classes', getTeacherClasses);
router.get('/classes/:classId/students', getClassStudents);
router.post('/attendance', submitAttendance);
router.post('/grades', submitGrades);

router.post('/', (_req: Request, res: Response) => {
  res.json({ message: 'Create teacher endpoint' });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: `Update teacher ${req.params.id} endpoint` });
});

router.delete('/:id', (req: Request, res: Response) => {
  res.json({ message: `Delete teacher ${req.params.id} endpoint` });
});

export default router;