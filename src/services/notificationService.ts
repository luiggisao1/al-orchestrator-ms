import { NotifyMessageContent } from '../models/types';
import { firebaseRealTimeDatabase } from './firebase';

class NotificationService {
  async notify(message: NotifyMessageContent): Promise<void> {
    switch (message.type) {
      case 'orderItem':
        await firebaseRealTimeDatabase.handleOrder(message);
        break;
      case 'ingredient':
        await firebaseRealTimeDatabase.handleIngredient(message);
        break;
      default:
        console.error(`Unknown message type: ${message.type}`);
    }
  }
}

export const notificationService = new NotificationService();
