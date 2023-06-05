import { Request, Response } from 'express';
import { RedisClient } from '@/lib/cache/RedisClient';
import { CacheKeys } from '@/lib/cache/CacheKeys';
import { API } from '@/lib/API';
import { Expiration } from '@/lib/cache/Expiration';
import { prisma } from '@/lib/db/prisma';
import { Security } from '@/utils/Security';
import { accountSelect } from '@/lib/db/Select';

async function getAccount(req: Request, res: Response) {
  let redis;
  try {
    redis = new RedisClient();
    const { email } = req.body;

    // Check cache first
    const accountKey = CacheKeys.accountKey(email);
    const cachedAccount = await redis.get(accountKey);
    if (cachedAccount) {
      return res.json(API.res(true, 'success', cachedAccount, 'Account found in cache'));
    }

    // Get account from database
    const account = await prisma.account.findUnique({ where: { email }, select: accountSelect });
    if (!account) {
      return res.status(404).json(API.res(true, 'info', null, 'Account not found'));
    }

    // Cache the account
    const EX = Expiration.getStdEX();
    redis.setToPipeline(accountKey, account, EX);

    return res.json(API.res(true, 'success', account, 'Account found'));
  } catch (error) {
    res.status(500).json(API.res(true, 'error', null, 'Error getting account'));
  } finally {
    redis?.quit();
  }
}

async function createAccount(req: Request, res: Response) {
  let redis;
  try {
    redis = new RedisClient();
    const { firstName, lastName, email, password } = req.body;

    // Create new account
    const pw = await Security.hashPassword(password);
    const account = await prisma.account.create({
      data: { firstName, lastName, email, password: pw },
      select: accountSelect,
    });

    // Cache the account
    const accountKey = CacheKeys.accountKey(email);
    const EX = Expiration.getStdEX();
    redis.setToPipeline(accountKey, account, EX);

    return res.json(API.res(true, 'success', account, 'Account created'));
  } catch (error) {
    // Handle duplicate email since email must be unique
    if (error.code === 'P2002') {
      return res.status(400).json(API.res(true, 'warning', null, 'Account already exists'));
    }
    res.status(500).json(API.res(true, 'error', null, 'Error creating account'));
  } finally {
    redis?.quit();
  }
}

export default {
  getAccount,
  createAccount,
};
