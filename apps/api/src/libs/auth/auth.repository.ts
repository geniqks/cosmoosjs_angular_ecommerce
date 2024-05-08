import type { Prisma, user } from "@prisma/client";
import { inject, injectable } from "inversify";
import { PrismaProvider } from "../prisma";

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