import { Response, Request, NextFunction } from 'express';
import { API } from '@/lib/API';

export default function jwtVerify(req: Request, res: Response, next: NextFunction) {
  const { access_token, refresh_token } = req.cookies;
  if (!access_token && !refresh_token) {
    return res.status(401).json(API.res(false, 'error', null, 'Invalid tokens'));
  }

  next();
}
