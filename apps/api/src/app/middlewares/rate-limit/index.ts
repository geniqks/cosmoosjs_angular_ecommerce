import { IocContainer, LoggerService, type ConfigService } from "@cosmoosjs/core";
import type { Server } from "@cosmoosjs/hono-openapi";
import type { SocketAddress } from 'bun';
import { rateLimiter, type Store } from "hono-rate-limiter";
import RedisStore from "rate-limit-redis";
import { createClient, type RedisClientType } from "redis";

function rateLimitHelper(redisClient: RedisClientType, limit: number, windowMs: number, keyGeneratorIdentifier: string,) {
  return rateLimiter({
    windowMs,
    limit,
    standardHeaders: "draft-6",
    keyGenerator: (ctx) => {
      const socketAddress = ctx.env?.ip as SocketAddress;
      return `${socketAddress.address}-${keyGeneratorIdentifier}`;
    },
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }) as unknown as Store,
  })
}

export async function setupRateLimit(server: Server, config: ConfigService) {
  try {
    const redisClient = createClient({
      url: config.get<string>('REDIS_URL')
    });

    await redisClient.connect();

    const typedRedisClient = redisClient as unknown as RedisClientType;
    // 20 requests per minute
    const minute = rateLimitHelper(typedRedisClient, 20, 60 * 1000, 'minute')
    // 1200 requests per day
    const days = rateLimitHelper(typedRedisClient, 1200, 24 * 60 * 60 * 1000, 'days')

    server.hono.use(minute);
    server.hono.use(days);
  } catch (error) {
    const logger = IocContainer.container.get(LoggerService);
    logger.pino.error('An error occurred while connecting to redis');
    logger.pino.error(error);
  }
}