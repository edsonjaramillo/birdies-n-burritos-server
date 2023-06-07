import { z } from 'zod';

export const loginValidation = z
  .object({
    email: z.string().email(),
    password: z.string(),
    isRemembered: z.boolean().optional(),
  })
  .strict();
