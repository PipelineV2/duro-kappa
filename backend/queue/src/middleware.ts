import { NextFunction } from "express";
import { sendError } from "expressapp/src/utils";
import log from "logger";

export const validator = (schema: { parse: Function }) => {
  return (req: any, res: any, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error: any) {
      log.error(error.message);
      return sendError(res, "Error occured");
    }
  }
}


