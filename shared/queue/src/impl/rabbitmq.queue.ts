import { Queue, QueueType } from '../index'
import { AMQPChannel, AMQPClient } from '@cloudamqp/amqp-client'
import log from "logger";

export default class RabbitMq implements Queue {
  client: any;

  async connect(): Promise<this> {
    this.client = await new AMQPClient("amqp://localhost").connect();
    return this;
  }

  // returns the number of messages in a queue.
  async declareQueue<Channel>(id: QueueType): Promise<{ channel: Channel, messages: number }> {
    try {
      const channel = await this.client.channel()
      await this.client.exchangeDeclare(id, 'topic');
      const q = await channel.queueDeclare(id);

      log.info(`queue ensured: ${q.name} : with ${q.messageCount} messages. 🏖️`);
      return { channel, messages: q.messageCount };
    } catch (error: any) {
      log.error(error.message)
      throw error;
    }
  }

  async ensureQueue(id: QueueType): Promise<boolean> {
    try {
      await this.declareQueue(id)
      return true;
    } catch (error: any) {
      log.error(error.message)
      throw error;
    }
  }

  async enqueue<T>(queue: QueueType, value: T, topic?: string): Promise<void> {
    console.log(queue, value)
    let channel;
    try {
      channel = (await this.ensureQueue(queue)).channel;
      const q = await channel.queue(queue);
      await q.publish(queue, topic, JSON.stringify(value))
      log.info("successfully enqueued notification")
    } catch (error: any) {
      log.error(error)
    } finally {
      channel.close();
    }
  }

  dequeue(): void {
    console.log('dqd')
  }

  async consume(queue: QueueType, callback: Function | Awaited<Function>): Promise<void> {
    const channel = await this.client.channel();
    const q = await channel.queue(queue);
    await q.subscribe({ noAck: true }, async (msg: any) => {
      await callback(msg);
      // await consumer.close();
    })
  }
}
