import { NextFunction, Request, Response } from 'express';
import log from "logger";

export default (schema: { parse: Function }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error: any) {
      log.error(error.message);
      res.status(400).json({ status: 'error', message: error.message })
      // next(`Error occured while validating input: ${error.message}`);
    }
  }
}


