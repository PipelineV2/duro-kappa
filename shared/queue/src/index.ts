import { AMQPMessage } from "@cloudamqp/amqp-client";
import RabbitMQ from "./impl/rabbitmq.queue";

export abstract class _Queue {
  abstract connect(): Promise<this>

  abstract enqueue<T>(queue: QueueType, value: T): Promise<void>

  abstract dequeue(queue: QueueType): void

  abstract length(): number
}

export abstract class Consumer {
  abstract consume(queue: QueueType, callback: Function | Awaited<Function>): Promise<void>
}

export type ConsumerMessage = AMQPMessage;

export type Queue = Consumer & _Queue;


export type DuroQueueOptions = {
  merchant_branch: string
  user: string
}
export const NOTIFICATION_QUEUE = "NOTIFICATION_QUEUE" as const;
export const MERCHANT_REGISTRATION_QUEUE = "MERCHANT_REGISTRATION_QUEUE" as const
export const DURO_QUEUE = "DURO_QUEUE" as const
export type QueueType = typeof NOTIFICATION_QUEUE | typeof MERCHANT_REGISTRATION_QUEUE | typeof DURO_QUEUE;

// implementations...
const queues = {
  "kafka": RabbitMQ
} as const;

type QueueName = keyof typeof queues;
type FactorySettings = {
  queue: QueueName;
  connection_string?: string;
}

function queueFactory({ queue = "kafka" }: FactorySettings) {
  return new queues[queue]();
}

export default (function() {
  let instance: Queue;
  return (): Queue => {
    if (instance) return instance;
    const { queue } = process.env as FactorySettings;
    instance = queueFactory({ queue });
    return instance;
  }
})();

