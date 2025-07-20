import { Router } from 'express';

import {
  generateOrder,
  getTotalOrders,
  getTotalOrdersCompleted,
  getTotalPurchaseOrders,
} from '@/controllers/orderController';

const router = Router();

router.post('/order', generateOrder);
router.get('/order/completed', getTotalOrdersCompleted);
router.get('/order/total', getTotalOrders);
router.get('/market/total', getTotalPurchaseOrders);

export default router;
