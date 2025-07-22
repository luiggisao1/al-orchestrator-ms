import { Channel, ChannelModel, connect } from 'amqplib';
import { NotifyMessageContent } from '@/models/types';
import { notificationService } from '@/services/notificationService';
import EventEmitter from 'events';

class ConsumerService {
  _channel?: Channel;
  isInitialized: boolean = false;
  _eventEmitter?: EventEmitter;

  async initialize(eventEmitter: EventEmitter): Promise<void> {
    if (!this.isInitialized) {
      this._eventEmitter = eventEmitter;
      await this._createChannel();
      await this._channel?.assertExchange(
        process.env.AMQP_EXCHANGE_NAME_ORDERS || 'exchange',
        'topic',
      );
      await this._channel?.assertQueue('reply_queue', { durable: true });
      await this._channel?.assertQueue('notify_queue', { durable: true });
      await this._channel?.bindQueue(
        'notify_queue',
        process.env.AMQP_EXCHANGE_NAME_ORDERS || 'exchange',
        'notify.*',
      );
      this.isInitialized = true;
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

    this._channel?.consume(
      'notify_queue',
      async (msg) => {
        if (msg !== null) {
          const content: NotifyMessageContent = JSON.parse(
            msg.content.toString(),
          );

          await notificationService.notify(content);
          this._channel?.ack(msg);
        }
      },
      { noAck: false },
    );

    this._channel?.consume('reply_queue', (message) => {
      if (message !== null) {
        this._eventEmitter?.emit(
          message.properties.correlationId.toString(),
          message,
        );
        this._channel?.ack(message);
      }
    });
  }
}

export const consumerService = new ConsumerService();
