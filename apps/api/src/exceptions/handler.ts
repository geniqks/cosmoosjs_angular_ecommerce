import type { LoggerService } from '@cosmoosjs/core';
import { PrismaClientErrorMap } from '@libs/providers/prisma/error-mappign.helper';
import { Prisma } from '@prisma/client';
import type * as hono from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { StatusCode } from 'hono/utils/http-status';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export default (err: Error, ctx: hono.Context, logger: LoggerService) => {
  logger.pino.error(err);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = PrismaClientErrorMap[err.code];
    throw new HTTPException(prismaError.httpCode as StatusCode, { message: prismaError.message })
  }
  return ctx.text(ReasonPhrases.INTERNAL_SERVER_ERROR, StatusCodes.INTERNAL_SERVER_ERROR);
};
