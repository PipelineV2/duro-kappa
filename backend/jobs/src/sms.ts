import { Router } from 'express';
import databaseClient from "database";
import { Merchant } from 'database/src/models';
import queueClient, { MERCHANT_REGISTRATION_QUEUE } from "queue"
import { sendError, sendSuccess } from "expressapp/src/utils"

const router = Router();
const database = databaseClient();
const queue = queueClient();
database.connect();
queue.connect();

router.post(
  '/customer-sms-message',
  async (_req, res) => {
    const merchant = _req.body as Merchant;
    try {
      const result = await database.insertMerchant(merchant)
      await queue.enqueue(MERCHANT_REGISTRATION_QUEUE, result.id)
      return sendSuccess(res, "Successfully registered your business.")
    } catch (error: any) {
      return sendError(res, error.message)
    }
  }
);

export default router;

