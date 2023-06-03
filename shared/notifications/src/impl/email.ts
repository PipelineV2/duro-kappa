import { NotificationService, NotificationOptions } from '../'
import Mailjet from 'node-mailjet';
import log from "logger";

export class EmailNotificationService implements NotificationService {
  client: Mailjet | null = null;

  connect(): this {
    const { PUBLIC_API_KEY = "", PRIVATE_API_KEY = "" } = process.env
    try {
      this.client = Mailjet.apiConnect(
        PUBLIC_API_KEY,
        PRIVATE_API_KEY,
        {
          config: {},
          options: {}
        }
      );
    } catch (error: any) {
      log.error("error occured while connecting to mailjet");
      throw error;
    }
    return this;
  }

  async sendNotification(notification: NotificationOptions): Promise<void> {
    console.log(notification)
    try {
      await this.client?.post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: "pilot@mailjet.com",
                Name: "Duro"
              },
              To: [
                {
                  Email: notification.destination,
                  Name: notification.destination
                }
              ],
              Subject: "Your email flight plan!",
              TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
              HTMLPart: "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
            }
          ]
        })
    } catch (error: any) {
      log.info(error.message);
      throw error;
    }
  }
}

