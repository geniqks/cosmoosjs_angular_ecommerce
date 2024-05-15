import { JwtMiddleware } from "@app/middlewares/jwt";
import { Get, Server } from "@cosmoosjs/hono-openapi";
import { AuthLoginResponseSchema } from "@libs/auth/auth.schema";
import type { Context } from "hono";
import { inject, injectable } from "inversify";
import type { IController } from "src/interfaces/controllers/controller.interface";

@injectable()
export class UserController implements IController {

  constructor(
    @inject(Server) private readonly server: Server,
    @inject(JwtMiddleware) private readonly jwtMiddleware: JwtMiddleware,
  ) { }

  public setup(): void {
    this.server.hono.use('/user/*', this.jwtMiddleware.get());
    this.me();
  }

  @Get({
    path: '/user/me',
    tags: ['User'],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: AuthLoginResponseSchema,
          },
        },
        description: 'Returns an error',
      },
    },
  })
  private me(ctx?: Context) {
    if (ctx) {
      return ctx.json({
        salut: 'cc'
      });
    }
  }
}