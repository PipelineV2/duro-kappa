import { Router, Response } from 'express';
import databaseClient from "database";
import queueClient, { DURO_QUEUE, MERCHANT_REGISTRATION_QUEUE } from "queue"
import { sendError, sendSuccess } from 'expressapp/src/utils';
import { loginValidator, auth } from './middleware';
import { Admin, Input } from 'database/src/models';
import log from "logger";

const router = Router();
const database = databaseClient();
const queue = queueClient();
database.connect();
queue.connect();



// admin logins...
router.use('/login', loginValidator);
router.post('/login/merchant', auth(true), (_, res) => {
  return sendSuccess(res, "Successfully logged in.");
})
router.post('/login/branch', auth(false), (_, res) => {
  return sendSuccess(res, "Successfully logged in.");
});


// queue actions
router.post('/advance-queue', auth(false), async (req: any & Admin, res: Response) => {
  // pop value from queue.
  try {
    const { userId: previousAttendedTo } = req.body;
    const { branchId } = req.user;
    const branch = await database.getBusinessBranchById(branchId)
    const userToAttendTo: string | null = await queue.dequeue<any, string>(DURO_QUEUE, { topic: branchId, total: branch.current_attended ?? 0 })

    if (!userToAttendTo)
      return sendSuccess(res, "There is nobody currently on the queue.");

    // update the branch's currently_attended
    await database.updateBusinessBranchById(branchId, { current_attended: (branch.current_attended ?? 0) + 1 })

    // update previous users' attending_to and current queue
    await database.updateUserById(previousAttendedTo, { in_queue: false, attending_to: false, current_queue: "" });

    // update next users' attending_to.
    await database.updateUserById(userToAttendTo, { attending_to: true, current_queue: branchId })

    // store current atending somewhere.
    console.log(req, res)
    return sendSuccess(res, "Suceessfully advanced queue. A Notification will be sent to the next user");
  } catch (error: any) {
    return sendError(res, "Error occured while advancing queue.")
  }
})

router.get('/currently-attending-to', auth(false), async (req, res) => {
  // get current user(s) that's being attended to from repository.
  // get all users with attending_to true, with current_queue for the
  // current branch
  console.log(req, res)
});

// SUPERADMIN JOB!
router.post('/create-branch', auth(true), async (req: any & { user: Admin }, res: any) => {
  // create a new branch
  const { location, coordinates } = req.body;
  const { username, email, password } = req.body as Input<Admin>;
  const { merchantId } = req.user;
  const { id, company_name } = await database.getMerchantById(merchantId);

  try {
    const branch = await database.insertBranch({
      merchantId,
      location,
      coordinates,
      qr_code: "",
      slug: `${location.split(" ").join("_").toLowerCase()}__${company_name}`
    })
    await database.insertAdmin({
      merchantId,
      branchId: branch.id,
      username, email, password, superAdmin: false
    })
    await queue.enqueue(MERCHANT_REGISTRATION_QUEUE, branch.id);

    log.info("successfully added branch to list. :", id)
    return sendSuccess(res, "Successfully registered your business branch.")
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

