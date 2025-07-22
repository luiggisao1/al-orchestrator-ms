import { initializeApp } from 'firebase/app';
import { firebaseDataBaseConfig } from './config';

import { NotifyMessageContent, OrderStatus } from '../../models/types';
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
      default:
        this.updateOrder(content.orderId, content.status);
        break;
    }
  }

  async updateOrder(orderId: string, status: OrderStatus): Promise<void> {
    return update(ref(this._db, `orders/${orderId}`), {
      status: status,
      updatedAt: new Date().toISOString(),
    });
  }

  async handleIngredient(content: NotifyMessageContent): Promise<void> {
    switch (content.status) {
      case 'created':
        await this.createPurchaseIngredient(content);
        break;
      case 'completed':
        await this.completeIngredient(content);
        break;
      default:
        console.error(`Unknown ingredient status: ${content.status}`);
    }
  }

  async createPurchaseIngredient(content: NotifyMessageContent): Promise<void> {
    const ingredientItem = {
      id: content.orderId,
      ingredientId: content.ingredient?.id,
      status: 'created',
      name: content.ingredient?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stock: content.ingredient?.stock ?? 0,
    };

    await set(ref(this._db, `market/${content.orderId}`), ingredientItem);
  }

  async completeIngredient(content: NotifyMessageContent): Promise<void> {
    await update(ref(this._db, `market/${content.orderId}`), {
      status: 'completed',
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
