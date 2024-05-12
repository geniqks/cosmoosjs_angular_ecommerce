import { ConfigService, IocContainer } from '@cosmoosjs/core';
import { Server } from '@cosmoosjs/hono-openapi';
import { setupRateLimit } from './middlewares/rate-limit';
import { setupHttpSecurity } from './middlewares/security';
import { setupSentry } from './middlewares/sentry';
import { loadSocketsEvents } from './middlewares/socket/load-socket';

export default async () => {
  const configServer = IocContainer.container.get(ConfigService);
  const server = IocContainer.container.get(Server);

  setupHttpSecurity(server, configServer);
  setupSentry(server, configServer);
  loadSocketsEvents()
  await setupRateLimit(server, configServer);
};
