import { LoggerService } from '@cosmoosjs/core';
import { GuardAbstract } from '@cosmoosjs/hono-openapi';
import type { Context } from 'hono';
import { inject, injectable } from 'inversify';

@injectable()
export class TestGuard extends GuardAbstract {
  constructor(@inject(LoggerService) private readonly loggerService: LoggerService) {
    super();
  }

  public run(_ctx: Context): void {
    this.loggerService.pino.info('Guard triggered');
  }
}
