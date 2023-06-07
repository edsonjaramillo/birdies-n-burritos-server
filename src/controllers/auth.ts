import { prisma } from '@/lib/db/prisma';
import { RedisClient } from '@/lib/cache/RedisClient';
import { Request, Response } from 'express';
import { API } from '@/lib/API';
import { Security } from '@/utils/Security';
import { accountAuthSelect, accountSelect } from '@/lib/db/Select';
import { CacheKeys } from '@/lib/cache/CacheKeys';
import { Expiration } from '@/lib/cache/Expiration';
import { env } from '@/env';
import { Cookies } from '@/utils/Cookies';
import { JWT } from '@/utils/JWT';

export const login = async (req: Request, res: Response) => {
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

    // Set tokens to httpOnly cookies

    // Sign tokens
    const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env;
    const accessToken = JWT.sign(account, JWT_ACCESS_SECRET);
    const refreshToken = JWT.sign(account, JWT_REFRESH_SECRET);

    // Get expirations for cookies
    const accessTokenEX = Expiration.accessTokenEX();
    const refreshTokenEX = Expiration.refreshTokenEX();

    // Set cookies
    const accessTokenCookie = Cookies.httpCookie('access_token', accessToken, accessTokenEX);
    const refreshTokenCookie = Cookies.httpCookie('refresh_token', refreshToken, refreshTokenEX);
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return res.json(API.res(true, 'success', account, 'Login successful.'));
  } catch (error) {
    return res.json(API.res(true, 'error', null, 'Error occured'));
  } finally {
    await redis?.quit();
  }
};

export default {
  login,
};
