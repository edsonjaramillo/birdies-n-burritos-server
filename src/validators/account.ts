import { z } from 'zod';

export const getAccountValidator = z
  .object({
    email: z.string().email(),
  })
  .strict();

export const createAccountValidator = z
  .object({
    email: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  })
  .strict();
