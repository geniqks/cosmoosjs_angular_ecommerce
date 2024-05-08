import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export class PrismaProvider {
  private _client = new PrismaClient();

  public get client() {
    return this._client;
  }
}