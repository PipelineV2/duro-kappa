import z from 'zod';
import validator from "input-validator";

export const createMerchantValidation = validator(z.object({
  "company_name": z.string(),
  "location": z.string(),
  "coordinates": z.string(),
  username: z.string(),
  email: z.string(),
  password: z.string()
}))

