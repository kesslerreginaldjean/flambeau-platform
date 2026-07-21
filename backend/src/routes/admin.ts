import { Router } from 'express';
import {
  getStats, getUsers, createUser, deleteUser, importUsers, getTeachers, getStudents,
  getPayments, createPayment, submitGrade, getAnnouncements, createAnnouncement, deleteAnnouncement,
  getStudentDetail, getSettings, updateSettings, getAdmissions, updateAdmissionStatus,
  recordAdmissionScore, getAcademicInfo,
} from '../controllers/adminController';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

// Audit P0-4: every admin route requires a valid JWT AND role=admin.
router.use(verifyToken, requireRole('admin'));

router.get('/stats', getStats);
router.get('/academic', getAcademicInfo);
router.get('/users', getUsers);
router.get('/teachers', getTeachers);
router.get('/students', getStudents);
router.get('/students/:id', getStudentDetail);
router.get('/settings', getSettings);
router.post('/settings', updateSettings);
router.get('/admissions', getAdmissions);
router.patch('/admissions/:id/score', recordAdmissionScore);
router.patch('/admissions/:id/status', updateAdmissionStatus);
router.get('/payments', getPayments);
router.get('/announcements', getAnnouncements);
router.post('/payments', createPayment);
router.post('/grades', submitGrade);
router.post('/announcements', createAnnouncement);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);
router.post('/users/import', importUsers);
router.delete('/announcements/:id', deleteAnnouncement);

router.get('/dashboard', (_req, res) => {
  res.json({ message: 'Summary for admin dashboard' });
});

export default router;
