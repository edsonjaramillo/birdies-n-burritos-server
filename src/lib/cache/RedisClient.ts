import { Redis, ChainableCommander } from 'ioredis';
import { env } from '@/env';

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
    return await this.redis.set(key, value);
  }

  setToPipeline(key: string, value: any, EX: number) {
    if (this.isDev) {
      console.log(`SET ${key} to pipeline with EX: ${EX}`);
    }
    return this.pipeline.set(key, JSON.stringify(value), 'EX', EX);
  }

  async execPipeline() {
    return await this.pipeline.exec();
  }

  async quit() {
    await this.execPipeline();
    await this.redis.quit();
  }
}
