import { injectable } from "inversify";
import type { PrismaProvider } from "../prisma";

@injectable()
export class AuthService {
  constructor(private prisma: PrismaProvider) { }
}