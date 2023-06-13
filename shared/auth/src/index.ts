import { Response, NextFunction } from "express";
import { sendError } from "expressapp/src/utils";
import databaseClient from "database";
import { User, Admin } from "database/src/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "config";

const database = databaseClient();
const SALT_ROUNDS = config.salt_rounds;
const TOKEN_SECRET_KEY = config.token_secret || "secret";

export const clientAuth = () => {
  return async (req: any & User, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    try {
      if (!authorization) throw new Error("close sesame");

      const [protocol, token] = authorization.split(" ");
      if (protocol !== "Bearer" || !token) throw new Error("gerrarahia! you sly being.");

      const result = jwt.verify(token, TOKEN_SECRET_KEY)
      const { email } = result as { email: string };
      const user = await database.getUserByEmailOrPhone({ email });

      if (!user)
        throw new Error("huhuhu... ");

      req.user = user;
      return next();
    } catch (error: any) {
      return sendError(res, error.message, { status: 401 })
    }
  }
}

export const adminAuth = (isSuperAdmin: boolean) => {
  return async (req: any & Admin, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    try {
      if (!authorization) throw new Error("close sesame");

      const [protocol, token] = authorization.split(" ");
      if (protocol !== "Bearer" || !token) throw new Error("gerrarahia! you sly being.");

      const result = jwt.verify(token, TOKEN_SECRET_KEY)
      const { email } = result as { email: string };
      const user = await database.getAdminByEmail(email);

      if (!user)
        throw new Error("huhuhu...");
      if (isSuperAdmin && !user.superAdmin)
        throw new Error("closed sesame");

      req.user = user;
      return next();
    } catch (error: any) {
      return sendError(res, error.message, { status: 401 })
    }
  }
}

export const signJWT = <T extends string | Record<string, string>>(value: T) => {
  return jwt.sign(value, TOKEN_SECRET_KEY);
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePassword = async ({ hashedPassword, password }: { hashedPassword: string, password: string }): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
}

export const extract = <T extends Record<string, any>>(object: T, key: string): Partial<T> => {
  delete object[key]
  return object;
}

