import { ControllerRoot } from "@app/controllers";
import { AuthRootController } from "@app/controllers/auth/auth-root.controller";
import { AuthRepository } from "@libs/auth/auth.repository";
import { AuthService } from "@libs/auth/auth.service";
import { TestGuard } from "@libs/guards/test.guard";
import { PrismaProvider } from "@libs/providers/prisma";
import { SocketProvider } from "@libs/providers/sockets";
import type { Container } from "inversify";


/**
 * This file will list all the application's injectables. 
 * They will then be injected into our ioc library "Inversify".
 * For more information 
 * @link https://inversify.io/
 */
export default (container: Container) => {
  container.bind(AuthRepository).toSelf().inRequestScope();
  container.bind(AuthRootController).toSelf().inRequestScope();
  container.bind(AuthService).toSelf().inRequestScope();
  container.bind(ControllerRoot).toSelf().inRequestScope();
  container.bind(PrismaProvider).toSelf().inSingletonScope();
  container.bind(SocketProvider).toSelf().inSingletonScope();
  container.bind(TestGuard).toSelf().inRequestScope();
};