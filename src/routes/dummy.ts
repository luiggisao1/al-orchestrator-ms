import { Router } from 'express';

import { getAllUsers } from '@/controllers/dummyController';

const router = Router();

router.get('/users', getAllUsers);

export default router;
