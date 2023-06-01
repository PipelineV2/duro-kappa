import { NotificationService, NotificationOptions } from "../"

export class SMSNotificationService extends NotificationService {
  constructor() {
    super()
  }

  connect(): void {

  }

  async sendNotification(notification: NotificationOptions): Promise<void> {
    console.log(notification)
  }
}


