import { AnyZodObject } from 'zod';
import { Response, Request, NextFunction } from 'express';
import { API } from '@/lib/API';

export function zodValidate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      return next();
    }
    return res.status(400).json(API.res(true, 'error', null, 'Invalid request body'));
  };
}
