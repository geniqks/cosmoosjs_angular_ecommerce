import { ConfigService } from "@cosmoosjs/core";
import type { Prisma } from "@prisma/client";
import { exclude } from "@utils/exclude.util";
import { inject, injectable } from "inversify";
import { AuthRepository } from "./auth.repository";

@injectable()
export class AuthService {

  constructor(
    @inject(AuthRepository) private readonly userRepository: AuthRepository,
    @inject(ConfigService) private readonly configService: ConfigService,
  ) { }

  public async register(userInput: Prisma.userUncheckedCreateInput): Promise<any> {
    const saltRound = this.configService.get<number>('SALT_ROUND');
    const password = userInput.password ?? '';
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: saltRound,
    });
    userInput.password = hashedPassword;
    const createdUser = await this.userRepository.create(userInput);
    const userWithoutPassword = exclude(createdUser, ['password']);
    return userWithoutPassword;
  }
}