import { Redis, ChainableCommander } from 'ioredis';

import { env } from '@/env';
import type { AnyObj } from '@/types';

export class RedisClient {
  private redis: Redis;
  private pipeline: ChainableCommander;
  private isDev: boolean;

  constructor() {
    const { REDIS_URL, NODE_ENV } = env;
    this.redis = new Redis(REDIS_URL);
    this.pipeline = this.redis.pipeline();
    this.isDev = NODE_ENV === 'development';
  }

  async get(key: string) {
    const cachedValue = await this.redis.get(key);
    if (this.isDev && cachedValue) {
      console.log(`GET ${key}`);
    }
    return cachedValue ? JSON.parse(cachedValue) : null;
  }

  async set(key: string, value: string, EX: number) {
    if (this.isDev) {
      console.log(`SET ${key} with EX: ${EX}`);
    }
    await this.redis.set(key, value);
  }

  setToPipeline(key: string, value: AnyObj, expiration: number) {
    if (this.isDev) {
      console.log(`SET ${key} to pipeline with EX: ${expiration}`);
    }
    this.pipeline.set(key, JSON.stringify(value), 'EX', expiration);
  }

  async quit() {
    await this.pipeline.exec();
    await this.redis.quit();
  }
}
