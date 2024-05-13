import { Post } from "@cosmoosjs/hono-openapi";
import type { UserLoginInput } from "@libs/auth/auth.interface";
import type { Prisma } from "@prisma/client";
import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import type { IController } from "src/interfaces/controllers/controller.interface";
import { AuthLoginInputSchema, AuthRegisterInputSchema } from "src/libs/auth/auth.schema";
import { AuthService } from "src/libs/auth/auth.service";
@injectable()
export class AuthRootController implements IController {

  constructor(
    @inject(AuthService) private readonly authService: AuthService,
  ) { }

  public setup(): void {
    this.login();
    this.register();
  }

  @Post({
    path: '/auth/login',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: AuthLoginInputSchema,
          },
        },
      },
    },
    responses: {}
  })
  public async login(ctx?: Context): Promise<unknown> {
    if (ctx) {
      const body = await ctx.req.json() as UserLoginInput;
      const loggedUser = await this.authService.login(body);
      ctx.status(StatusCodes.OK);
      return ctx.json(loggedUser);
    };
  }

  @Post({
    path: '/auth/register',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: AuthRegisterInputSchema,
          },
        },
      },
    },
    responses: {},
  })
  public async register(ctx?: Context): Promise<unknown> {
    if (ctx) {
      const body = (await ctx.req.json()) as Prisma.userUncheckedCreateInput;
      const userCreated = await this.authService.register(body);
      ctx.status(StatusCodes.CREATED);
      return ctx.json(userCreated);
    }
  }
}