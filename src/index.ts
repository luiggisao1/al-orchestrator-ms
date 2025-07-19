import cors from 'cors';
import express from 'express';
import orderRouter from '@/routes/orderRouter';
import { consumerService } from '@/services/consumer';
import { producerService } from './services/producer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', orderRouter);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await consumerService.initialize();
  await producerService.initialize();
});

export default app;
