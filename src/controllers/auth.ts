import { Request, Response } from 'express';

import { env } from '@/env';
import { API } from '@/lib/API';
import { CacheKeys } from '@/lib/cache/CacheKeys';
import { Expiration } from '@/lib/cache/Expiration';
import { RedisClient } from '@/lib/cache/RedisClient';
import { accountAuthSelect, accountSelect } from '@/lib/db/Select';
import { prisma } from '@/lib/db/prisma';
import { Cookies } from '@/utils/Cookies';
import { JWT } from '@/utils/JWT';
import { Security } from '@/utils/Security';

async function login(req: Request, res: Response) {
  let redis;
  try {
    const { email, password } = req.body;
    const accountCredentials = await prisma.account.findUnique({ where: { email: email }, select: accountAuthSelect });
    if (!accountCredentials) {
      return res.json(API.res(false, 'warning', null, 'Invalid credentials.'));
    }

    const isPasswordValid = await Security.verifyPassword(accountCredentials.password, password);
    if (!isPasswordValid) {
      return res.json(API.res(false, 'warning', null, 'Invalid credentials.'));
    }

    const account = await prisma.account.findUnique({ where: { email: email }, select: accountSelect });
    redis = new RedisClient();
    redis.setToPipeline(CacheKeys.accountKey(account.email), account, Expiration.getStdEX());

    // Get expirations for cookies
    const accessTokenEX = Expiration.accessTokenEX();
    const refreshTokenEX = Expiration.refreshTokenEX();

    // Sign tokens
    const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env;
    const accessToken = JWT.sign(account, JWT_ACCESS_SECRET, accessTokenEX);
    const refreshToken = JWT.sign(account, JWT_REFRESH_SECRET, refreshTokenEX);

    // Set cookies
    const accessTokenCookie = Cookies.httpCookie('accessToken', accessToken, accessTokenEX);
    const refreshTokenCookie = Cookies.httpCookie('refresh_token', refreshToken, refreshTokenEX);
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return res.json(API.res(true, 'success', account, 'Login successful.'));
  } catch (error) {
    return res.json(API.res(true, 'error', null, 'Error occured'));
  } finally {
    await redis?.quit();
  }
}

async function logout(req: Request, res: Response) {
  const clearAccessToken = Cookies.httpCookie('accessToken', '', 0);
  const clearRefreshToken = Cookies.httpCookie('refresh_token', '', 0);

  res.setHeader('Set-Cookie', [clearAccessToken, clearRefreshToken]);
  return res.json(API.res(true, 'success', null, 'Logout successful.'));
}

export default { login, logout };
