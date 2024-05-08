import { Get, Guards } from '@cosmoosjs/hono-openapi';
import type * as hono from 'hono';
import { inject, injectable } from 'inversify';
import type { IController } from 'src/interfaces/controllers/controller.interface';
import { TestGuard } from 'src/libs/guards/test.guard';
import { AuthRootController } from './auth/auth-root.controller';

@injectable()
export class ControllerRoot implements IController {

  constructor(
    @inject(AuthRootController) private readonly authRootController: AuthRootController,
  ) { }

  public setup(): void {
    this.authRootController.setup();
    this.helloWorld();
  }

  @Get({
    path: '/',
    responses: {},
  })
  @Guards(TestGuard)
  private helloWorld(ctx?: hono.Context): unknown {
    if (ctx) {
      return ctx.text('salut')
    }
  }
}
