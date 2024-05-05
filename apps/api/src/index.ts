import { ControllerRoot } from '@app/controllers';
import type { ConfigService, IBootstrapConfig } from '@cosmoosjs/core';
import { AppFactory, IocContainer, LoggerService } from '@cosmoosjs/core';
import type { FactoryOASMetadatas } from '@cosmoosjs/hono-openapi';
import { serve } from 'bun';
import dotenv from 'dotenv';
dotenv.config();

/**
 * The server will be configured with all given options
 * and will return the http config in order to start the server.
 */
const boostrapApp = async () => {
  const config = await AppFactory<FactoryOASMetadatas>().defineConfigAndBootstrapApp((config: ConfigService) => {
    const bootstrapedConfig: IBootstrapConfig<FactoryOASMetadatas> = {
      adapters: {
        server: {
          port: config.get<number>('PORT'),
          metadata: {
            enableSwaggerInProd: false,
            swaggerUrl: 'swagger',
            openapi: {
              url: 'doc',
              config: {
                info: {
                  title: 'E-commerce API',
                  version: 'v1',
                },
                openapi: '3.1.0',
                servers: [
                  {
                    url: config.get('API_URL'),
                  },
                ],
              },
            },
          },
          provider: () => import('@cosmoosjs/hono-openapi'),
          exceptions: () => import('@exceptions/handler'),
        },
      },
      loaders: {
        env: () => import('@start/env'),
        ioc: () => import('@start/ioc-loader'),
      },
      entrypoint: () => import('@app/index'),
    };
    return bootstrapedConfig;
  });
  return config;
};

boostrapApp().then((httpConfig) => {
  const logger = IocContainer.container.get(LoggerService);
  const controllerRoot = IocContainer.container.get(ControllerRoot);
  try {
    serve({
      async fetch(req, server) {
        const serverConfig = await httpConfig?.fetch(req, { ip: server.requestIP(req) });
        return serverConfig;
      },
      port: httpConfig?.port,
    });

    controllerRoot.setup();
    logger.pino.info(`Hono 🥟 Server Listening on port ${httpConfig?.port}`);
  } catch (e) {
    logger.pino.error(`An error occurred during server initialization, ${e}`);
  }
});
