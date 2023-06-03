import z from 'zod';
import log from "logger";
import validator from "input-validator";
import databaseClient from "database";
import { sendError } from 'expressapp/src/utils';
import { Response, NextFunction } from 'express';
import { Admin } from 'database/src/models';

export const validation = validator(
  z.object({
    "company_name": z.string(),
    "location": z.string(),
    "coordinates": z.string()
  })
)

export const loginValidator = validator(
  z.object({
    "email": z.string(),
    "password": z.string()
  })
)

export const auth = (isSuperAdmin: boolean) => async (req: any & { user: Admin }, res: Response, next: NextFunction) => {
  const database = databaseClient();
  try {
    const { email } = req.body;
    if (!email)
      throw new Error(`Invalid authentication!. please provide an email"}`)

    const user = await database.getAdminByEmail(email);
    if (!user) throw new Error("Admin not found with this email.")
    if (isSuperAdmin && !user.superAdmin)
      throw new Error("Invalid authentication! You're not allowed to access this route.");

    req.user = user;
    return next();
  } catch (error: any) {
    log.error(error)
    return sendError(res, error.message);
  }
}
