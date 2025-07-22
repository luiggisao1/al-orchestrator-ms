import { Channel, ChannelModel, connect, ConsumeMessage } from 'amqplib';
import { randomUUID } from 'crypto';
import EventEmitter from 'events';

class Producer {
  private _channel?: Channel;
  private _eventEmitter?: EventEmitter;

  async _createChannel(): Promise<void> {
    const url = process.env.AMQP_URL || 'amqp://localhost';
    const connection: ChannelModel = await connect(url);
    this._channel = await connection.createChannel();
  }

  async initialize(eventEmitter: EventEmitter): Promise<void> {
    if (!this._channel) {
      await this._createChannel();
      await this._channel!.assertExchange('orders_exchange', 'topic');
      this._eventEmitter = eventEmitter;
    }
  }

  async publishMessage(routingKey: string, message: Buffer): Promise<boolean> {
    if (!this._channel) {
      await this._createChannel();
    }
    try {
      return (
        this._channel?.publish('orders_exchange', routingKey, message) ?? false
      );
    } catch (error) {
      console.error('Failed to publish message:', error);
      return false;
    }
  }

  async sendToQueue<T>(
    queue: string,
    message: Buffer,
    headers?: { [key: string]: any },
  ): Promise<T | undefined> {
    if (!this._channel) {
      await this._createChannel();
    }
    try {
      const uuid = randomUUID();

      const properties = {
        correlationId: uuid,
        replyTo: 'reply_queue',
        headers: headers,
      };

      this._channel?.sendToQueue(queue, message, properties) ?? false;
      return new Promise((resolve) => {
        this._eventEmitter?.once(uuid, async (data: ConsumeMessage) => {
          const reply: T = JSON.parse(data.content.toString());
          resolve(reply);
        });
      });
    } catch (error) {
      console.error('Failed to send message to queue:', error);
      return undefined;
    }
  }
}

export const producerService = new Producer();
