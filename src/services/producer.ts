import { Channel, ChannelModel, connect } from 'amqplib';

class Producer {
  private _channel?: Channel;

  async _createChannel(): Promise<void> {
    const url = process.env.AMQP_URL || 'amqp://localhost';
    const connection: ChannelModel = await connect(url);
    this._channel = await connection.createChannel();
  }

  async initialize(): Promise<void> {
    if (!this._channel) {
      await this._createChannel();
      await this._channel!.assertExchange('orders_exchange', 'topic');
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
}

export const producerService = new Producer();
