import { PrismaProvider } from "@libs/providers/prisma";
import { inject, injectable } from "inversify";

@injectable()
export class UserRepository {
  constructor(
    @inject(PrismaProvider) private readonly prisma: PrismaProvider
  ) { }

  public async isExist(username: string): Promise<boolean> {
    const isExist = await this.prisma.client.user.findUnique({
      where: {
        username
      }
    })
    return !!isExist;
  }
}