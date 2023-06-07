import jwt from 'jsonwebtoken';

import type { AnyObj } from '@/types';

type JWTVerifyResult = {
  status: boolean;
  payload: jwt.JwtPayload | null;
};

export class JWT {
  static sign(payload: AnyObj, secret: string, expiresIn: number) {
    return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn });
  }

  static verify(token: string, secret: string): JWTVerifyResult {
    let status = true;
    let payload = null;
    try {
      payload = jwt.verify(token, secret) as jwt.JwtPayload;
    } catch (err) {
      status = false;
    }
    return { status, payload };
  }
}
