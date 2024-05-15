import type { Prisma, user } from "@prisma/client";

export type UserLoginInput = Prisma.userGetPayload<{
  select: {
    username: any,
    password: any;
  };
}> & {
  googleIdToken: string,
  googleClientId: string,
};

export type UserWithoutPassword = Omit<user, 'password'>;
export type LoginResponse = UserWithoutPassword & { token: string }