import z from 'zod';
import validator from "input-validator";

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
