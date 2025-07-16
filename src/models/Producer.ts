import { Channel, ChannelModel, connect } from 'amqplib';

export class Producer {
  private channel?: Channel;

  async _createChannel(): Promise<void> {
    const url = process.env.AMQP_URL || 'amqp://localhost';
    const connection: ChannelModel = await connect(url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(exchange: string, routingKey: string, message: Buffer): Promise<boolean> {
    if (!this.channel) {
      await this._createChannel();
    }
    try {
      await this.channel?.assertExchange(exchange, 'direct');
      return this.channel?.publish(exchange, routingKey, message) ?? false;
    } catch (error) {
      console.error("Failed to publish message:", error);
      return false;
    }
  }
}
