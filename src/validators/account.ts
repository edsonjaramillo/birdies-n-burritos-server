import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,255}$/;

export const getAccountValidator = z
  .object({
    email: z.string().email(),
  })
  .strict();

export const createAccountValidator = z
  .object({
    email: z.string().email().max(255),
    password: z.string().max(255).regex(passwordRegex),
    firstName: z.string().max(255),
    lastName: z.string().max(255),
  })
  .strict();
