import queueClient, { MERCHANT_REGISTRATION_QUEUE, NOTIFICATION_QUEUE, ConsumerMessage } from "queue"
import log from "logger";
import { NotificationOptions } from 'notifications'
import storageClient from "storage";
import databaseClient from 'database';
import { Branch } from "database/src/models";
import qrcode = require("qrcode");


const MERCHANT_QR_URL_BASE = '';

async function run() {
  const queue = await queueClient().connect();
  const database = databaseClient().connect();
  const storage = storageClient().connect();
  try {
    await queue.consume(MERCHANT_REGISTRATION_QUEUE, async (value: ConsumerMessage) => {
      console.log(value);
      try {
        const id = value.bodyToString()
        if (!id)
          throw new Error("invalid id");

        const merchant: Branch = await database.getBusinessBranchById(id)
        const merchant_url: string = `${MERCHANT_QR_URL_BASE}/${merchant.slug}`;
        console.log('sd', merchant)
        const filename = `${merchant.merchant.company_name}__${merchant.slug}`;

        // generate qr.
        const merchant_qr = await qrcode.toDataURL(merchant_url);
        const url: string = await storage.upload(filename, merchant_qr)

        // update the merchant's qr_code url.
        await database.updateBusinessBranchById(`${merchant.id}`, { ...merchant, qr_code: url });
        log.info(`Successfully updated merchant with id:${merchant.id}'s qr_code: ${url}`)

        // enqueue notification.
        await queue.enqueue<NotificationOptions>(
          NOTIFICATION_QUEUE,
          {
            channel: "email",
            destination: "me",
            message: "Congrats!!"
          }
        )
      } catch (error: any) {
        log.error(error.message);
      }
    })
  } catch (e: any) {
    log.error("ERROR", e.message)
  }
}

// run()
export default run;

