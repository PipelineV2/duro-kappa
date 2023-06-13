import log from "logger";
import notificationService, { NotificationOptions, NotificationService } from "notifications";
import queueService, { NOTIFICATION_QUEUE } from "queue";

const message = (type: string) => {
  switch (type) {
    case "MERCHANT_REGISTRATION":
      return `congratulations, you have registered your business. you can add more branches on your dashboard.`
    default:
      return ``;
  }
};

async function run() {
  try {
    const notifications = notificationService();
    const queue = await queueService().connect();
    const channels = {
      email: notifications.getInstanceOfNotificationType("email").connect(),
      sms: notifications.getInstanceOfNotificationType("sms").connect()
    }

    await queue.consume(NOTIFICATION_QUEUE, {}, async (value: string) => {
      const { destination, channel, type } = JSON.parse(value) as NotificationOptions;
      log.info(value);
      log.info(`${type}, ${destination}`)
      try {
        const transporter: NotificationService = channels[channel];
        await transporter.sendNotification({ message: message(type), destination })
      } catch (error: any) {
        log.error(error.message);
      }
    })
  } catch (e: any) {
    log.error("ERROR", e.message)
  }
}

export default run;

