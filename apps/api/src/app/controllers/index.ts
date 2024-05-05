import { Get, Guards } from '@cosmoosjs/hono-openapi';
import type * as hono from 'hono';
import { injectable } from 'inversify';
import { TestGuard } from 'src/libs/guards/test.guard';

@injectable()
export class ControllerRoot {

  public setup(): void {
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
