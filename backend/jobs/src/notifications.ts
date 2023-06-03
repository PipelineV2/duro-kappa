import log from "logger";
import notificationService, { NotificationOptions, NotificationService } from "notifications";
import queueService, { NOTIFICATION_QUEUE } from "queue";

async function run() {
  try {
    const notifications = notificationService();
    const queue = await queueService().connect();
    const channels = {
      email: notifications.getInstanceOfNotificationType("email").connect(),
      sms: notifications.getInstanceOfNotificationType("sms").connect()
    }

    await queue.consume(NOTIFICATION_QUEUE, {}, async (value: string) => {
      const { destination, channel, message } = JSON.parse(value) as NotificationOptions;
      log.info(value);
      log.info(`${message}, ${destination}`)
      try {
        const transporter: NotificationService = channels[channel];

        await transporter.sendNotification({ message, destination })
      } catch (error: any) {
        log.error(error.message);
      }
    })
  } catch (e: any) {
    log.error("ERROR", e.message)
  }
}

export default run;

