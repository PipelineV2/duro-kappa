import { Queue, QueueType } from '../index'
import log from "logger";
import { Redis as RedisClient } from 'ioredis';
import databaseClient from "database";
import { Database } from "database/src/models";
import _config from "config";
const config = _config.queue;

export default class Redis implements Queue {
  client: RedisClient | null = null;
  database: Database | null = null;
  consuming: boolean = false;

  async connect(): Promise<this> {
    return new Promise((resolve, reject) => {
      try {
        this.client = new RedisClient(config.connection_url);
        this.database = databaseClient().connect();
        resolve(this)
      } catch (error: any) {
        log.error(error.message);
        reject('err')
      }
    })
  }

  async enqueue<T>(queue: QueueType, { topic, value }: T & { topic: string, value: string }): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.xadd(`${queue}:${topic ?? ""}`, "*", "value", value);
    } catch (error: any) {
      log.error(error.message)
      throw error;
    }
  }

  async dequeue<T, U>(queue: QueueType, { topic }: T & { topic: string, total?: any }): Promise<U | null> {
    try {
      const queueName = `${queue}:${topic ?? ""}`;
      let response = await this.client?.xread(
        "COUNT", 1,
        "BLOCK", 5000,
        "STREAMS", queueName, 0
      );
      if (!response) return null;

      const id = response?.[0]?.[1]?.[0]?.[0];
      if (!id) return null;

      const value = response?.[0]?.[1]?.[0]?.[1]?.[1];
      // should maybe have a retry queue??
      const del = await this.client?.xdel(queueName, id);
      log.info(`dequeued ${del} from the queue.`)
      return value as U;
    } catch (error: any) {
      log.error(error.message)
      throw new Error("an error occurred while dequeueing")
    }
  }

  async dequeueItem(queue: QueueType, position: string, options: { topic: string }): Promise<string> {
    try {
      const queueName = `${queue}:${options.topic}`;
      const list = await this.getQueue(queue, options)
      log.info(list);
      let found;

      // TODO:: move this routine to the redis engine...
      for (let i of list) {
        const [id, [, _value]] = i;
        if (_value == position) {
          found = id;
          break;
        }
      }

      if (!found) throw new Error("did not find item on the stream list");

      await this.client?.xdel(queueName, found);
      return `${queue}.${position}`
    } catch (error: any) {
      log.error("error occurred while dequeueing at position.")
      throw error;
    }
  }

  async getQueue(queue: QueueType, options: { topic: string }): Promise<any[]> {
    try {
      const queueName = `${queue}:${options.topic ?? ""}`;
      const length = await this.length(queue, { topic: options.topic })
      const list = await this.client?.xread(
        "COUNT", length,
        "BLOCK", 5000,
        "STREAMS", queueName, 0
      );

      return list?.[0]?.[1] ?? [];
    } catch (error: any) {
      log.error("an error occured while getting index of item from queue")
      throw error;
    }
  }

  async getIndexOf(queue: QueueType, value: string, options: { topic: string }): Promise<number> {
    try {
      const list = await this.getQueue(queue, options)
      let found = -1;

      for (let i = 0; i < list.length; i++) {
        const [, [, _value]] = list[i];
        if (value === _value) {
          found = i + 1;
          break;
        }
      }

      return found;
    } catch (error: any) {
      log.error("an error occured while getting index of item from queue")
      throw error;
    }
  }

  async consume(queue: QueueType, options: { topic: string }, callback: Function | Awaited<Function>): Promise<void> {
    this.consuming = true;
    while (this.consuming) {
      try {
        //log.info('starting dequeue.')
        let res = await this.dequeue(queue, { ...options });
        //log.info(res);
        if (res)
          await callback(res);
      } catch (error: any) {
        // append to retry queue. 
        log.error(error.message)
      }
    }
  }

  async length(queue: QueueType, _options: { read?: number, topic?: string }): Promise<number> {
    try {
      const options = { read: 0, topic: "", ..._options };
      const queueName = `${queue}:${options.topic}`;
      const length = await this.client?.xlen(queueName);
      if (length == undefined) throw new Error("This queue is invalid :(");

      return Math.abs(options?.read - length);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

