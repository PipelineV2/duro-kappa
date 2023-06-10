import validator from "input-validator";
import z from 'zod';

export const joinQueueValidation = validator(
  z.object({
    "email": z.string().email(),
  })
)

export const previewQueueValidation = validator(
  z.object({
    queueId: z.number()
  })
)
