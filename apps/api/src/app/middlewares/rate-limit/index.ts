import { IocContainer, LoggerService, type ConfigService } from "@cosmoosjs/core";
import type { Server } from "@cosmoosjs/hono-openapi";
import type { SocketAddress } from 'bun';
import { rateLimiter, type Store } from "hono-rate-limiter";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

export async function setupRateLimit(server: Server, config: ConfigService) {
  try {
    const redisClient = createClient({
      url: config.get<string>('REDIS_URL')
    });

    await redisClient.connect();
    const limiter = rateLimiter({
      windowMs: 60 * 1000,
      limit: 5,
      standardHeaders: "draft-6",
      keyGenerator: (ctx) => {
        const socketAddress = ctx.env?.ip as SocketAddress;
        return socketAddress.address;
      },
      store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      }) as unknown as Store,
    });

    server.hono.use(limiter);
  } catch (error) {
    const logger = IocContainer.container.get(LoggerService);
    logger.pino.error('An error occurred while connecting to redis');
    logger.pino.error(error);
  }
}