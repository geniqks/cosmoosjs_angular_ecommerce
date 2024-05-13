import { ConfigService } from "@cosmoosjs/core";
import type { Prisma } from "@prisma/client";
import { exclude } from "@utils/exclude.util";
import { OAuth2Client } from "google-auth-library";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import type { LoginResponse, UserLoginInput } from "./auth.interface";
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

  public async login(user: UserLoginInput): Promise<LoginResponse> {
    const userFound = await this.userRepository.findUniqueByUsernameOrEmail(user.username);
    if (userFound) {
      const userPassword = userFound.password ?? '';
      const password = user.password ?? '';
      const isMatch = await Bun.password.verify(password, userPassword);
      const jwtSecret = this.configService.get<string>('JWT_TOKEN');
      const userWithoutPassword = exclude(userFound, ['password']);

      // Handle google login
      if (user.googleIdToken) {
        const token = await sign(userWithoutPassword, jwtSecret);
        const email = await this.handleGoogleLogin(user.googleIdToken, user.googleClientId);
        // If the email is verified then bypass the password
        if (email === userFound.email) {
          return {
            ...userWithoutPassword,
            token,
          };
        } else {
          throw new HTTPException(StatusCodes.UNAUTHORIZED, {
            message: ReasonPhrases.UNAUTHORIZED,
          });
        }
      } else {
        if (isMatch) {
          const token = await sign(userWithoutPassword, jwtSecret);
          return {
            ...userWithoutPassword,
            token,
          };
        } else {
          // For security reason we will never tell if the user exist or not
          throw new HTTPException(StatusCodes.NOT_FOUND, {
            message: `User '${user.username}' ${ReasonPhrases.NOT_FOUND}`,
          });
        }
      }
    } else {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: `User '${user.username}' ${ReasonPhrases.NOT_FOUND}`,
      });
    }
  }

  /**
   * Verify google token to bypass the password
   */
  private async handleGoogleLogin(googleToken: string, googleId: string) {
    try {
      const client = new OAuth2Client();
      // Typed as any because the library does not have the correct types
      // https://stackoverflow.com/a/70138295/15431338
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        requiredAudience: googleId,
      } as any);

      const payload = ticket.getPayload();
      if (payload) {
        // TODO: par la suite on peut ajouter le user dans la base de donnée
        const googleUserid = payload['sub'];
        return payload.email;
      }
    } catch (error) {
      return false;
    }
  }

}