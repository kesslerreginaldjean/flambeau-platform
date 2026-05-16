import { Router, Request, Response } from 'express';
import { getParentDashboard, getChildDetails } from '../controllers/parentController';

const router = Router();

router.get('/:id/dashboard', getParentDashboard);
router.get('/children/:childId', getChildDetails);

router.post('/', (_req: Request, res: Response) => {
  res.json({ message: 'Create parent endpoint' });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: `Update parent ${req.params.id} endpoint` });
});

router.delete('/:id', (req: Request, res: Response) => {
  res.json({ message: `Delete parent ${req.params.id} endpoint` });
});

export default router;