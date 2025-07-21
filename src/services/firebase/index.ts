import { initializeApp } from 'firebase/app';
import { firebaseDataBaseConfig } from './config';

import { NotifyMessageContent, OrderStatus } from '@/models/types';
import { getDatabase, set, ref, update } from 'firebase/database';

type FirebaseApp = ReturnType<typeof initializeApp>;

class FirebaseRealTimeDatabase {
  private readonly _firebase: FirebaseApp;
  private readonly _db: ReturnType<typeof getDatabase>;

  constructor() {
    this._firebase = initializeApp(firebaseDataBaseConfig);
    this._db = getDatabase(this._firebase);
  }

  async handleOrder(content: NotifyMessageContent): Promise<void> {
    switch (content.status) {
      case 'pending':
        await this.createOrderItem(
          content.orderId,
          content.orderItemId!,
          content.dishId!,
        );
        break;
      case 'preparing':
      case 'completed':
      case 'waiting':
        this.updateOrder(content.orderId, content.status);
        break;
      default:
        console.error(`Unknown order item status: ${content.status}`);
    }
  }

  async updateOrder(orderId: string, status: OrderStatus): Promise<void> {
    return update(ref(this._db, `orders/${orderId}`), {
      status: status,
      updatedAt: new Date().toISOString(),
    });
  }

  async updateIngredient(content: NotifyMessageContent): Promise<void> {
    switch (content.status) {
      case 'pending':
        await this.createIngredient(content);
        break;
      case 'completed':
        await this.completeIngredient(content);
        break;
      default:
        console.error(`Unknown ingredient status: ${content.status}`);
    }
  }

  async createIngredient(content: NotifyMessageContent): Promise<void> {
    const ingredientItem = {
      id: content.ingredient?.id,
      status: 'pending',
      name: content.ingredient?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stock: content.ingredient?.stock ?? 0,
    };

    await set(
      ref(this._db, `ingredients/${content.ingredient?.id}`),
      ingredientItem,
    );
  }

  async completeIngredient(content: NotifyMessageContent): Promise<void> {
    const ingredientId = content.ingredient?.id;

    await update(ref(this._db, `ingredients/${ingredientId}`), {
      status: 'pending',
      stock: content.ingredient?.stock ?? 0,
      updatedAt: new Date().toISOString(),
    });
  }

  async createOrderItem(
    orderId: string,
    orderItemId: string,
    dishId: string,
  ): Promise<void> {
    const orderItem = {
      id: orderItemId,
      status: 'created',
      dishId: dishId.toString(),
      orderId: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await set(ref(this._db, `orders/${orderItemId}`), orderItem);
  }
}

export const firebaseRealTimeDatabase = new FirebaseRealTimeDatabase();
