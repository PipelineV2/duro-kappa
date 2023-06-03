import { Router, Request, Response } from 'express';
import databaseClient from "database";
import z from 'zod';
import log from "logger";
import queueClient, { DURO_QUEUE, NOTIFICATION_QUEUE } from "queue"
import { sendError, sendSuccess } from 'expressapp/src/utils';
import { NotificationOptions } from 'notifications'
import { validator } from './middleware';

const router = Router();
const database = databaseClient();
const queue = queueClient();
database.connect();
queue.connect();

const validation = z.object({
  "email": z.string(),
})

// join queue.
router.post('/join/:merchant_branch', validator(validation), async (_req, res) => {
  const { email } = _req.body;
  const { merchant_branch } = _req.params;
  try {
    if (!merchant_branch || !email)
      throw new Error("Invalid input. Please send in an email.")

    let user = await database.getUserByEmailOrPhone({ email });
    if (!user) {
      log.info(`User with email: ${email} was not found. Creating a new user.`);
      user = await database.insertUser({ email, in_queue: true, current_queue: merchant_branch })
      log.info(`successfully created user with email: ${email}`)
    } else {
      log.info(`user with email: ${email} was found. yay!`)
      if (user.in_queue)
        throw new Error("You are already on a queue. You have to leave your current queue before you can join another one.");

      await database.updateUserById(`${user.id}`, { in_queue: true, current_queue: merchant_branch })
      log.info(`updated user with email: ${email} to be in queue for merchant with id: ${merchant_branch}`)
    }

    log.info(`enqueueing the user for the merchant with id: ${merchant_branch}`)
    await queue.enqueue(DURO_QUEUE, { topic: merchant_branch, value: `${user.id}` });
    const length = await queue.length(DURO_QUEUE);
    log.info('done')

    log.info(`enqueueing notification to the user.`)
    await queue.enqueue(NOTIFICATION_QUEUE, {
      topic: "",
      value: JSON.stringify({
        channel: user.email ? 'email' : "sms",
        destination: user.phone ?? user.email ?? "",
        message: `You have been queued. you are number ${length} on the queue`
      })
    });
    log.info('done')
    log.info(`successfully queued user with email : ${email}`)

    const token = { email };
    return sendSuccess(res, { token, message: "Successfully registered your business." })
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, error.message)
  }
});

router.post('/leave', async (_req, res) => {
  const { token } = _req.body;
  // validate token, extract email from token, and leave the queue. 
  const { email } = token;

  try {
    let user = await database.getUserByEmailOrPhone({ email });

    if (!user || !user.current_queue)
      throw new Error("You are currently not on a queue.");

    if (user.attending_to)
      throw new Error("You are currently being attended to, the admin will do the rest. Cheers!")

    let merchant = await database.getBusinessBranchById(user.current_queue);
    await database.updateBusinessBranchById(user.current_queue, { current_attended: (merchant.current_attended ?? 0) + 1 });
    await queue.dequeueItem(DURO_QUEUE, `${user.id}`, { topic: `${merchant.id}` })
    await database.updateUserById(`${user.id}`, { in_queue: false, current_queue: "", attending_to: false })
    await queue.enqueue<NotificationOptions>(NOTIFICATION_QUEUE, {
      channel: user.email ? 'email' : "sms",
      destination: user.phone ?? user.email ?? "",
      message: `You have now left the queue. Thank you for using this service.`
    });

    log.info("successfully added dequeued user to merchant list. :")
    return sendSuccess(res, "Successfully dequeued user.");
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, error.message)
  }
})


// get current position on queue
router.get('/position', async (req: Request, res: Response) => {
  const { token } = req.body;
  const { email } = token; // parse token.

  try {
    const user = await database.getUserByEmailOrPhone({ email })
    if (!user || !user.in_queue || !user.current_queue)
      throw new Error("You are currently not on a queue.");

    if (user.attending_to)
      return sendSuccess(res, "You are currently being attended to.");

    const position = await queue.getIndexOf(DURO_QUEUE, `${user.id}`, { topic: user.current_queue })
    console.log(position);
    if (position < 0)
      throw new Error("You are currently not on the queue.")

    return sendSuccess(res, { position });
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, "An error occured, please try again later.")
  }
})


export default router;

