import { Router } from 'express';

import {
  getOrders,
  getOrderById,
  generateOrder,
  getTotalOrders,
  getTotalOrdersCompleted,
  getTotalPurchaseOrders,
  getMarketOrders,
} from '../controllers/orderController';

const router = Router();

router.post('/orders', generateOrder);
router.get('/orders', getOrders);
router.get('/order/:orderId', getOrderById);
router.get('/orders/completed', getTotalOrdersCompleted);
router.get('/orders/total', getTotalOrders);
router.get('/market/total', getTotalPurchaseOrders);
router.get('/market/orders', getMarketOrders);

export default router;
