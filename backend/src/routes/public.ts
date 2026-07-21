import { Router } from 'express';
import { getSchoolPublicInfo } from '../controllers/publicController';

const router = Router();

// Truly public, no auth.
router.get('/school-info', getSchoolPublicInfo);

export default router;
