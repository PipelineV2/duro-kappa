import log from "logger";
import { EmailNotificationService } from "./impl/email";
import { SMSNotificationService } from "./impl/sms";

const NotificationServices = {
  "email": EmailNotificationService,
  "sms": SMSNotificationService
} as const;


export abstract class NotificationService {
  constructor() { }
  abstract connect(): void
  abstract sendNotification(notification: Omit<NotificationOptions, 'channel'>): Promise<void>
}

export type NotificationOptions = {
  destination: "broadcast" | string;
  message: string;
  channel: NotificationType | "all";
}
export type NotificationType = keyof typeof NotificationServices;
type NotificationServicesListType<Type> = { -readonly [Property in keyof Type]: Type[Property] }
type NotificationServicesListType1<Type> = { -readonly [Property in keyof Type]: NotificationService }

class Factory {
  data: Partial<NotificationServicesListType1<typeof NotificationServices>> = {};

  constructor(values: NotificationServicesListType<typeof NotificationServices>) {
    for (let i of Object.keys(values)) {
      const idx = i as NotificationType;
      const Constructor = values[idx];
      this.data[idx] = new Constructor();
    }
  }

  getInstanceOfNotificationType = (type: NotificationType): NotificationService => {
    return new NotificationServices[type]();
  }
}

export default (function() {
  log.info("this is entering")
  let instance: Factory;
  return (): Factory => {
    if (!instance) instance = new Factory(NotificationServices);
    return instance;
  }
})()
