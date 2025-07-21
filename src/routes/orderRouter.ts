import { Router } from 'express';

import {
  getOrderById,
  generateOrder,
  getTotalOrders,
  getTotalOrdersCompleted,
  getTotalPurchaseOrders,
} from '@/controllers/orderController';

const router = Router();

router.post('/orders', generateOrder);
router.get('/order/:orderId', getOrderById);
router.get('/orders/completed', getTotalOrdersCompleted);
router.get('/orders/total', getTotalOrders);
router.get('/market/total', getTotalPurchaseOrders);

export default router;
