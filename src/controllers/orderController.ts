import { Request, Response } from 'express';
import { producerService } from '@/services/producer';

export const getOrderById = async (
  req: Request<{ orderId: string }>,
  res: Response,
): Promise<void> => {
  const { orderId } = req.params;
  const message = Buffer.from(JSON.stringify({ orderId }));

  const result = await producerService.sendToQueue(
    'kitchen_rpc_queue',
    message,
    { function: 'orders-get' },
  );

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({
      error: `Order with ID ${orderId} not found.`,
    });
  }
};

export const generateOrder = async (
  req: Request<{}, {}, { quantity: number; recipeId?: number }>,
  res: Response,
): Promise<void> => {
  const quantity = req.body.quantity || 1;
  const message = Buffer.from(
    JSON.stringify({ quantity, recipeId: req.body.recipeId }),
  );

  const result = await producerService.sendToQueue(
    'kitchen_rpc_queue',
    message,
    { function: 'orders-generate' },
  );
  if (result) {
    res.status(201).json(result);
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

export const getMarketOrders = async (
  _: Request,
  res: Response,
): Promise<void> => {
  const message = Buffer.from(JSON.stringify({}));

  const result = await producerService.sendToQueue(
    'warehouse_rpc_queue',
    message,
    { function: 'market-orders' },
  );

  if (result) {
    res.status(201).json(result);
  } else {
    res.status(500).json({
      error: 'Failed to send order to the kitchen.',
    });
  }
};

export const getOrders = async (_: Request, res: Response): Promise<void> => {
  const message = Buffer.from(JSON.stringify({}));

  const result = await producerService.sendToQueue(
    'kitchen_rpc_queue',
    message,
    { function: 'orders-data' },
  );

  if (result) {
    res.status(201).json(result);
  } else {
    res.status(500).json({
      error: 'Failed to send order to the kitchen.',
    });
  }
};
