import { Router } from 'express';

import { generateOrder } from '@/controllers/orderController';

const router = Router();

router.post('/order', generateOrder);

export default router;
