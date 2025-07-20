import { Router } from 'express';

import {
  getIngredients,
  purchaseIngredient,
} from '@/controllers/ingredientController';

const router = Router();

router.get('/', getIngredients);
router.post('/purchase', purchaseIngredient);

export default router;
