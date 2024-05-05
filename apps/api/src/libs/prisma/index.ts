import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class PrismaProvider {
  private client = new PrismaClient();

  public getClient() {
    return this.client;
  }
}