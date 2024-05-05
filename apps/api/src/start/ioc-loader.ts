import { ControllerRoot } from "@app/controllers";
import type { Container } from "inversify";
import { TestGuard } from "src/libs/guards/test.guard";
import { PrismaProvider } from "src/libs/prisma";

/**
 * This file will list all the application's injectables. 
 * They will then be injected into our ioc library "Inversify".
 * For more information 
 * @link https://inversify.io/
 */
export default (container: Container) => {
  container.bind(ControllerRoot).toSelf().inRequestScope();
  container.bind(PrismaProvider).toSelf().inSingletonScope();
  container.bind(TestGuard).toSelf().inRequestScope();
};