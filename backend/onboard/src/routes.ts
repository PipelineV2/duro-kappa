import log from "logger";
import { Router } from 'express';
import databaseClient from "database";
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
    let merchant;
    // merchant = await database.getMerchantWhere({ company_name: company_name.toLowerCase() })
    // if(merchant) throw new Error("This merchant already exists")

    merchant = await database.insertMerchant({ company_name: company_name.toLowerCase() })
    const branch = await database.insertBranch({
      merchantId: merchant.id,
      location,
      coordinates,
      qr_code: "",
      slug: `${location.split(" ").join("_").toLowerCase()}__${company_name}`
    })
    await database.insertAdmin({
      merchantId: merchant.id,
      branchId: branch.id,
      username, email, password, superAdmin: true
    })
    await queue.enqueue(MERCHANT_REGISTRATION_QUEUE, { topic: "", value: `${branch.id}` });

    log.info("successfully added business to list. :", merchant.id)
    return sendSuccess(res, "Successfully registered your business.")
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, error.message)
  }
});

export default router;

