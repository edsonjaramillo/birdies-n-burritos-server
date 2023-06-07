import jwt from 'jsonwebtoken';
import type { AnyObj } from '@/types';

export class JWT {
  static sign(payload: AnyObj, secret: string) {
    return jwt.sign(payload, secret, { algorithm: 'HS256' });
  }
}
