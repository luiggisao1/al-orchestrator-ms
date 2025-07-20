import { Request, Response } from 'express';
import { producerService } from '@/services/producer';
import { Ingredient } from '@/models/types';

export const getIngredients = async (
  _: Request,
  res: Response,
): Promise<void> => {
  const message = Buffer.from(JSON.stringify({}));
  const result = await producerService.sendToQueue<Ingredient>(
    'warehouse_rpc_queue',
    message,
    { function: 'ingredient-get' },
  );
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(200).json([]);
  }
};

export const purchaseIngredient = async (
  req: Request<{}, {}, { id: number; quantity: number }>,
  res: Response,
): Promise<void> => {
  const message = Buffer.from(
    JSON.stringify({
      ingredientId: req.body.id,
      quantityRequired: req.body.quantity,
    }),
  );
  const result = await producerService.sendToQueue<Ingredient>(
    'warehouse_rpc_queue',
    message,
    { function: 'ingredient-purchase' },
  );
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(200).json([]);
  }
};
