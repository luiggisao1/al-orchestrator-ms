import { Channel, ChannelModel, connect } from 'amqplib';
import { NotifyMessageContent } from '@/models/types';
import { notificationService } from '@/services/notificationService';

class ConsumerService {
  _channel?: Channel;
  isInitialized: boolean = false;

  async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await this._createChannel();
      this.isInitialized = true;
      await this._channel?.assertExchange(
        process.env.AMQP_EXCHANGE_NAME_ORDERS || 'exchange',
        'topic',
      );
      await this._channel?.assertQueue('notify_queue', { durable: true });
      await this._channel?.bindQueue(
        'notify_queue',
        process.env.AMQP_EXCHANGE_NAME_ORDERS || 'exchange',
        'notify.*',
      );
    }

    await this.consumeMessages();
  }

  async _createChannel(): Promise<void> {
    const url = process.env.AMQP_URL || 'amqp://localhost';
    const connection: ChannelModel = await connect(url);
    this._channel = await connection.createChannel();
  }

  async consumeMessages(): Promise<void> {
    if (!this._channel) {
      await this._createChannel();
    }

    console.log(' [*] Waiting for messages in NOTIFY. To exit press CTRL+C');

    this._channel?.consume(
      'notify_queue',
      async (msg) => {
        if (msg !== null) {
          const content: NotifyMessageContent = JSON.parse(
            msg.content.toString(),
          );
          console.log(' [x] Received %s', content.type);

          await notificationService.notify(content);
          console.log('Done processing');
          this._channel?.ack(msg);
        }
      },
      { noAck: false },
    );
  }
}

export const consumerService = new ConsumerService();
