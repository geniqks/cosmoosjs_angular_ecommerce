import { Post } from "@cosmoosjs/hono-openapi";
import type { Context } from "hono";
import { injectable } from "inversify";
import type { IController } from "src/interfaces/controllers/controller.interface";
@injectable()
export class AuthRootController implements IController {
  public setup(): void {
    this.login();
    this.register();
  }


  @Post({
    path: '/auth/login',
    request: {},
    responses: {}
  })
  public async login(ctx?: Context): Promise<unknown> {
    return;
  }

  @Post({
    path: '/auth/register',
    request: {},
    responses: {}
  })
  public async register(ctx?: Context): Promise<unknown> {
    return;
  }
}