import { PrismaProvider } from "@libs/providers/prisma";
import { inject, injectable } from "inversify";

@injectable()
export class UserRepository {
  constructor(
    @inject(PrismaProvider) private readonly prisma: PrismaProvider
  ) { }

  public async isExist(input: string): Promise<boolean> {
    const isExist = await this.prisma.client.user.findFirst({
      where: {
        OR: [
          {
            email: input
          },
          { username: input },
        ],
      },
    })
    return !!isExist;
  }
}