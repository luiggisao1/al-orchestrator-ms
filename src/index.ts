import cors from 'cors';
import express from 'express';
import orderRouter from '@/routes/orderRouter';
import ingredientRouter from '@/routes/ingredientsRouter';
import { consumerService } from '@/services/consumer';
import { producerService } from './services/producer';
import EventEmitter from 'events';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', orderRouter);
app.use('/ingredients', ingredientRouter);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  const eventEmitter = new EventEmitter();
  await consumerService.initialize(eventEmitter);
  await producerService.initialize(eventEmitter);
});

export default app;
