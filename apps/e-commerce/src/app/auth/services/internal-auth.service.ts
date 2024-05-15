import { Injectable } from "@angular/core";

@Injectable()
export class InternalAuthService {
  public canActivate(): boolean {
    return true;
  }
}