import { NotifyMessageContent } from '@/models/types';
import { firebaseRealTimeDatabase } from '@/services/firebase';

class NotificationService {
  async notify(message: NotifyMessageContent): Promise<void> {
    switch (message.type) {
      case 'orderItem':
        await firebaseRealTimeDatabase.updateOrderItem(message);
        break;
      case 'ingredient':
        await firebaseRealTimeDatabase.updateIngredient(message);
        break;
      default:
        console.error(`Unknown message type: ${message.type}`);
    }
  }
}

export const notificationService = new NotificationService();
