import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  HOST: z.enum(['localhost', 'https://google.com']),
  PORT: z.string().regex(/^\d+$/).nonempty(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  REDIS_URL: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  JWT_ACCESS_SECRET: z.string().nonempty(),
  JWT_REFRESH_SECRET: z.string().nonempty(),
});

export const env = envSchema.parse(process.env);
