import z from 'zod';
import validator from "input-validator";

export const validation = validator(
  z.object({
    "company_name": z.string(),
    "location": z.string(),
    "coordinates": z.string().optional()
  })
)

export const loginValidator = validator(
  z.object({
    "email": z.string().email(),
    "password": z.string()
  })
)

export const createMerchantValidation = validator(
  z.object({
    "company_name": z.string(),
    "location": z.string(),
    "coordinates": z.string().optional(),
    username: z.string(),
    email: z.string().email(),
    password: z.string()
  })
)

export const dismissUserValidation = validator(
  z.object({
    userId: z.number(),
  })
);

export const advanceQueueValidation = validator(
  z.object({
    userId: z.number().optional(),
    queueId: z.number()
  })
);

export const queueActionValidation = validator(
  z.object({
    queueId: z.number()
  })
);

