import { Request, Response } from 'express';
import { producerService } from '@/services/producer';

export const generateOrder = async (
  req: Request<{}, {}, { quantity: number }>,
  res: Response,
): Promise<void> => {
  const quantity = req.body.quantity || 1;
  const message = Buffer.from(JSON.stringify({ quantity }));

  const result = await producerService.publishMessage('order.created', message);

  if (result) {
    res.status(201).json({
      message: `Order with quantity ${quantity} has been sent to the kitchen.`,
    });
  } else {
    res.status(500).json({
      error: 'Failed to send order to the kitchen.',
    });
  }
};

export const getTotalOrdersCompleted = async (
  _: Request,
  res: Response,
): Promise<void> => {
  const message = Buffer.from(JSON.stringify({}));

  const result = await producerService.sendToQueue(
    'kitchen_rpc_queue',
    message,
    { function: 'orders-complete' },
  );

  if (result) {
    res.status(201).json(result);
  } else {
    res.status(500).json({
      error: 'Failed to send order to the kitchen.',
    });
  }
};

export const getTotalOrders = async (
  _: Request,
  res: Response,
): Promise<void> => {
  const message = Buffer.from(JSON.stringify({}));

  const result = await producerService.sendToQueue(
    'kitchen_rpc_queue',
    message,
    { function: 'orders-total' },
  );

  if (result) {
    res.status(201).json(result);
  } else {
    res.status(500).json({
      error: 'Failed to send order to the kitchen.',
    });
  }
};

export const getTotalPurchaseOrders = async (
  _: Request,
  res: Response,
): Promise<void> => {
  const message = Buffer.from(JSON.stringify({}));

  const result = await producerService.sendToQueue(
    'warehouse_rpc_queue',
    message,
    { function: 'market-total' },
  );

  if (result) {
    res.status(201).json(result);
  } else {
    res.status(500).json({
      error: 'Failed to send order to the kitchen.',
    });
  }
};
