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

const auth = async (req, res, next) => {
  const { phone, email, name } = req.body;

  if (!phone && !email) return sendError(res, `Invalid authentication!. please provide a${phone ? " phone number" : "n email "}`)

  const user = await database.getUserByEmail(email);
  req.user = user;
  next();
}

const validation = z.object({
  "company_name": z.string(),
  "location": z.string(),
  "coordinates": z.string()
})

router.post('/advance-queue', async (req, res) => {
  // pop value from queue.
  // store current atending somewhere.
  console.log(req, res)
})

router.get('/current-user', async (req, res) => {
  // get current user from repository.
  console.log(req, res)
});

router.get('/user-queue-position', async (req, res) => {
  // get user's position on the queue
  console.log(req, res)
});

export default router;

