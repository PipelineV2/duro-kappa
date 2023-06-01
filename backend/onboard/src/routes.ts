import { Router } from 'express';
import databaseClient from "database";
import z from 'zod';
import log from "logger";
import { Branch, Input, Merchant, UserInput } from 'database/src/models';
import queueClient, { MERCHANT_REGISTRATION_QUEUE, NOTIFICATION_QUEUE } from "queue"
import { sendError, sendSuccess } from 'expressapp/src/utils';
import { NotificationOptions, NotificationType } from 'notifications'
import { validator } from './middleware';

const router = Router();
const database = databaseClient();
const queue = queueClient();
database.connect();
queue.connect();

const validation = z.object({
  "company_name": z.string(),
  "location": z.string(),
  "coordinates": z.string()
})

router.post('/merchant', validator(validation), async (_req, res) => {
  const { company_name } = _req.body as Input<Merchant>;
  const { location, coordinates } = _req.body as Input<Branch>;

  try {
    const result = await database.insertMerchant({ company_name })
    const branch = await database.insertBranch({
      merchantId: result.id,
      location,
      coordinates,
      qr_code: "",
      slug: `${location.split(" ").join("_").toLowerCase()}__${company_name}`
    })
    await queue.enqueue(MERCHANT_REGISTRATION_QUEUE, branch.id);

    log.info("successfully added business to list. :", result.id)
    return sendSuccess(res, "Successfully registered your business.")
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, error.message)
  }
});

router.post('/user', async (req, res) => {
  const { email, phone, name } = req.body as Input<UserInput>;
  let channel: NotificationType = email ? "email" : "sms";
  let destination: string = email ?? phone ?? "";

  try {
    await database.insertUser({ email, phone, name });
    await queue.enqueue<NotificationOptions>(NOTIFICATION_QUEUE, {
      channel,
      destination,
      message: "Congrats!!"
    });
    return sendSuccess(res, "Signed up successfully!")
  } catch (error: any) {
    return sendError(res, error.message)
  }
})

router.patch('/merchant', async (req, res) => {
  console.log(req, res);
})

router.patch('/user', async (req, res) => {
  console.log(req, res)
})


export default router;

