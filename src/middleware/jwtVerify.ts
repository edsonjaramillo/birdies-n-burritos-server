import { Response, Request, NextFunction } from 'express';

import { env } from '@/env';
import { API } from '@/lib/API';
import { Expiration } from '@/lib/cache/Expiration';
import { prisma } from '@/lib/db/prisma';
import { Cookies } from '@/utils/Cookies';
import { JWT } from '@/utils/JWT';

export default async function jwtVerify(req: Request, res: Response, next: NextFunction) {
  const { access_token, refresh_token } = req.cookies;
  if (!access_token && !refresh_token) {
    return res.status(401).json(API.res(false, 'error', null, 'Invalid tokens'));
  }

  const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env;
  const { status: accessStatus } = JWT.verify(access_token, JWT_ACCESS_SECRET);
  const { status: refreshStatus, payload: refreshTokenPayload } = JWT.verify(refresh_token, JWT_REFRESH_SECRET);

  if (accessStatus) {
    return next();
  }

  if (!accessStatus && refreshStatus) {
    const account = await prisma.account.findUnique({ where: { email: refreshTokenPayload.email } });

    const accessTokenEX = Expiration.accessTokenEX();
    const refreshTokenEX = Expiration.refreshTokenEX();

    const accessToken = JWT.sign(account, JWT_ACCESS_SECRET, accessTokenEX);
    const refreshToken = JWT.sign(account, JWT_REFRESH_SECRET, refreshTokenEX);

    const accessTokenCookie = Cookies.httpCookie('access_token', accessToken, accessTokenEX);
    const refreshTokenCookie = Cookies.httpCookie('refresh_token', refreshToken, refreshTokenEX);

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return next();
  }
}
