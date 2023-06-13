import log from "logger";
import { Router } from 'express';
import databaseClient from "database";
import { hashPassword, extract } from "auth";
import { Admin, Branch, Input, Merchant } from 'database/src/models';
import queueClient, { MERCHANT_REGISTRATION_QUEUE } from "queue"
import { sendError, sendSuccess } from 'expressapp/src/utils';
import * as validator from './middleware';

const router = Router();
const database = databaseClient();
const queue = queueClient();
database.connect();
queue.connect();

router.post('/merchant', validator.createMerchantValidation, async (_req, res) => {
  const { company_name } = _req.body as Input<Merchant>;
  const { location, coordinates } = _req.body as Input<Branch>;
  const { username, email, password } = _req.body as Input<Admin>;

  try {
    let merchant, admin;
    admin = await database.getAdminByEmail(email);
    if (admin)
      throw new Error("this email is already associated with a merchant.")

    merchant = await database.insertMerchant({ company_name: company_name.toLowerCase() })
    const branch = await database.insertBranch({
      merchantId: merchant.id,
      location,
      coordinates,
      slug: `${location.split(" ").join("_").toLowerCase()}__${company_name}`
    })
    const hashedPassword = await hashPassword(password);
    admin = await database.insertAdmin({
      merchantId: merchant.id,
      branchId: branch.id,
      username, email, password: hashedPassword, superAdmin: true
    })
    await queue.enqueue(
      MERCHANT_REGISTRATION_QUEUE,
      { topic: "", value: `${branch.id}` }
    );

    log.info("successfully added business to list. :", merchant.id)
    const clean_user = extract(admin, 'password');

    return sendSuccess(
      res,
      "Successfully registered your business. You will get an email with details about your qr code. Thank you for using our service!",
      { data: { user: clean_user, token: '' } }
    )
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, error.message)
  }
});

export default router;

