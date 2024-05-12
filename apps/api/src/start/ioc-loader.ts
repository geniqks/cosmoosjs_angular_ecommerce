import { ControllerRoot } from "@app/controllers";
import { AuthRootController } from "@app/controllers/auth/auth-root.controller";
import { AuthRepository } from "@libs/auth/auth.repository";
import { AuthService } from "@libs/auth/auth.service";
import { TestGuard } from "@libs/guards/test.guard";
import { PrismaProvider } from "@libs/providers/prisma";
import { SocketProvider } from "@libs/providers/sockets";
import { UserRepository } from "@libs/user/user.repository";
import { UserService } from "@libs/user/user.service";
import type { Container } from "inversify";

/**
 * This file will list all the application's injectables. 
 * They will then be injected into our ioc library "Inversify".
 * For more information 
 * @link https://inversify.io/
 */
export default (container: Container) => {
  //#region Singletons
  container.bind(PrismaProvider).toSelf().inSingletonScope();
  container.bind(SocketProvider).toSelf().inSingletonScope();
  //#endregion

  //#region RequestScope
  container.bind(TestGuard).toSelf().inRequestScope();
  container.bind(AuthRepository).toSelf().inRequestScope();
  container.bind(AuthRootController).toSelf().inRequestScope();
  container.bind(AuthService).toSelf().inRequestScope();
  container.bind(UserService).toSelf().inRequestScope();
  container.bind(ControllerRoot).toSelf().inRequestScope();
  container.bind(UserRepository).toSelf().inRequestScope();
  //#endregion
};