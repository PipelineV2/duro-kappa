import { Router, Response } from 'express';
import databaseClient from "database";
import queueClient, { NOTIFICATION_QUEUE, DURO_QUEUE, MERCHANT_REGISTRATION_QUEUE } from "queue"
import { sendError, sendSuccess } from 'expressapp/src/utils';
import { loginValidator } from './middleware';
import { Admin, Input } from 'database/src/models';
import log from "logger";
import { adminAuth, comparePassword, hashPassword, signJWT } from "auth"


const router = Router();
const database = databaseClient();
const queue = queueClient();
database.connect();
queue.connect();

// admin logins...
router.post('/login', loginValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await database.getAdminByEmail(email);
    if (!user)
      throw new Error("oops! invalid email and password combination.");

    const isValid = await comparePassword({ hashedPassword: user.password, password });
    if (!isValid)
      throw new Error("oops! invalid email and password combination.")

    return sendSuccess(res, "Logged in successfully!", { data: { token: signJWT({ email }) } })
  } catch (error: any) {
    return sendError(res, `closed sesame: ${error.message}`, { status: 401 });
  }
})

// queue actions
router.post('/advance-queue', adminAuth(false), async (req: any & Admin, res: Response) => {
  try {
    const { userId: previousAttendedTo } = req.body;
    const { branchId, id } = req.user;
    const branch = await database.getBusinessBranchById(branchId)
    log.info(`admin:${id} is trying to advance queue with branchId ${branchId}`)

    // update previous users' attending_to and current queue
    // and ensure that only the users in the admin's queue are updated.
    if (previousAttendedTo) {
      log.info(`dispatching user ${previousAttendedTo}. au reviour!`)
      await database.updateUserById(
        previousAttendedTo,
        { in_queue: false, attending_to: false, current_queue: null },
        { current_queue: branchId, in_queue: true }
      );
    }

    // get the next user to attend to & update their relevant fields.
    const userToAttendTo: string | null = await queue.dequeue<any, string>(DURO_QUEUE, { topic: branchId, total: branch.current_attended ?? 0 })
    log.info(userToAttendTo ? `this is user to attend: ${userToAttendTo}` : 'there are no users to attend to. relax, & chop life.')
    if (!userToAttendTo)
      return sendSuccess(res, "There is nobody currently on the queue.");
    const { email } = await database.updateUserById(Number.parseInt(userToAttendTo), { attending_to: true, current_queue: branchId })

    // notify the user.
    await queue.enqueue(
      NOTIFICATION_QUEUE,
      {
        topic: "",
        value: JSON.stringify({
          channel: "email",
          destination: email,
          message: "Congrats!!"
        })
      }
    );
    return sendSuccess(res, "Suceessfully advanced queue. A Notification will be sent to the next user");
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, "Error occured while advancing queue.")
  }
})

router.get('/currently-attending-to', adminAuth(false), async (req: any & { user: Admin }, res) => {
  try {
    const { branchId } = req.user;
    const people = await database.getUsers({ current_queue: branchId, in_queue: true });
    return sendSuccess(res, "Suceessfully retrieved list of currently attending to", { data: people });
  } catch (error: any) {
    return sendError(res, "An error occured while getting the list of people you're currently attending to. Please try again later.")
  }
});

// SUPERADMIN JOB!
router.post('/branch/create', adminAuth(true), async (req: any & { user: Admin }, res: any) => {
  const { location, coordinates } = req.body;
  const { username, email, password } = req.body as Input<Admin>;
  const { merchantId } = req.user;

  try {
    const { id, company_name } = await database.getMerchantById(merchantId);
    const admin = await database.getAdminByEmail(email);
    if (admin)
      throw new Error("this email is already attached to an admin. please try another.")

    const branch = await database.insertBranch({
      merchantId,
      location,
      coordinates,
      qr_code: "",
      slug: `${location.split(" ").join("_").toLowerCase()}__${company_name}`
    })
    const _password = await hashPassword(password);
    await database.insertAdmin({
      merchantId,
      branchId: branch.id,
      username, email, password: _password, superAdmin: false
    })
    await queue.enqueue(MERCHANT_REGISTRATION_QUEUE, branch.id);

    log.info("successfully added branch to list. :", id)
    return sendSuccess(res, "Successfully registered your business branch.")
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, error.message)
  }
});

router.post('/branch/list', adminAuth(true), async (req: any & { user: Admin }, res: any) => {
  const { merchantId } = req.user;

  try {
    const { branch: branches } = await database.getMerchantById(merchantId);
    return sendSuccess(res, "Successfully retrieved branch list", { data: branches });
  } catch (error: any) {
    log.error(error.message);
    return sendError(res, error.message)
  }
});

// update merchant details
//router.patch('/merchant', async (req, res) => {
//  console.log(req, res);
//})



export default router;

