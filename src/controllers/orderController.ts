import { Request, Response } from 'express';
import { Producer } from '@/models/Producer';

export const generateOrder = async (
  req: Request<{}, {}, { quantity: number }>,
  res: Response,
): Promise<void> => {
  const producer = new Producer();
  const exchange = process.env.AMQP_EXCHANGE_NAME_ORDERS || 'orders_exchange';
  const routingKey = process.env.AMQP_ROUTING_KEY_KITCHEN || 'new_order';
  const quantity = req.body.quantity || 1;
  const message = Buffer.from(JSON.stringify({ quantity }))

  const result = await producer.publishMessage(exchange, routingKey, message);

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
