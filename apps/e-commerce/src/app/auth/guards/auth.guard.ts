import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { InternalAuthService } from "../services/internal-auth.service";

export const canActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const test = inject(InternalAuthService).canActivate();
  return true;
  // return inject(PermissionsService).canActivate(inject(UserToken), route.params['id']);
};