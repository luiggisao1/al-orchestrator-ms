import { Request, Response } from 'express';
import { producerService } from '@/services/producer';
import { Ingredient } from '@/models/types';

export const getIngredients = async (
  _: Request,
  res: Response,
): Promise<void> => {
  const message = Buffer.from(JSON.stringify({}));
  const result = await producerService.sendToQueue<Ingredient>(
    'ingredients_rpc_queue',
    message,
  );
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(200).json([]);
  }
};
