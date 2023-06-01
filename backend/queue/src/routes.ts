import { Router } from 'express';
import databaseClient from "database";
import z from 'zod';
import log from "logger";
import queueClient, { DURO_QUEUE, DuroQueueOptions, NOTIFICATION_QUEUE } from "queue"
import { sendError, sendSuccess } from 'expressapp/src/utils';
import { NotificationOptions } from 'notifications'
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

router.post('/join/:merchant_branch', validator(validation), async (_req, res) => {
  const { id } = _req.body;
  const { merchant_branch } = _req.params;
  const user = await database.getUserById(id)

  try {
    if (user.in_queue)
      throw new Error("you are already on a queue");

    await database.updateUserById(`${user.id}`, { in_queue: true })
    await queue.enqueue<DuroQueueOptions>(DURO_QUEUE, { merchant_branch, user: `${user.id}` });
    const messages = queue.length();

    await queue.enqueue<NotificationOptions>(NOTIFICATION_QUEUE, {
      channel: user.email ? 'email' : "sms",
      destination: user.phone ?? user.email ?? "",
      message: `You have been queued. you are number ${messages + 1} on the queue`
    });

    log.info("successfully added queued user to merchant list. :")
    return sendSuccess(res, "Successfully registered your business.")
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, error.message)
  }
});

export default router;

