import { PrismaProvider } from "@libs/providers/prisma";
import type { Prisma, user } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export class AuthRepository {
  constructor(
    @inject(PrismaProvider) private readonly prisma: PrismaProvider
  ) { }

  public async create(user: Prisma.userUncheckedCreateInput): Promise<user> {
    return this.prisma.client.user.create(
      {
        data: {
          ...user,
          created_at: new Date(),
        }
      }
    );
  }
}