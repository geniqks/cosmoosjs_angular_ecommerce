import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponseSchema } from '@app/api/models';
import { BehaviorSubject, Observable } from 'rxjs';

// to make a cookie readable in SSR, inject the token from nguniversal module
// import { REQUEST } from '@nguniversal/express-engine/tokens';
// and make Request available in NodeJs
// import { Request } from 'express';

@Injectable({ providedIn: 'root' })
export class AuthState {
  // create an internal subject and an observable to keep track
  private stateItem: BehaviorSubject<AuthResponseSchema | null> = new BehaviorSubject(
    null
  );
  stateItem$: Observable<AuthResponseSchema | null> = this.stateItem.asObservable();

  // redirect update
  get redirectUrl(): string {
    return localStorage.getItem('redirectUrl');
  }
  set redirectUrl(value: string) {
    localStorage.setItem('redirectUrl', value);
  }

  constructor(
    private router: Router
  ) // to inject the REQUEST token, we do this:
  // @Optional() @Inject(REQUEST) private request: Request
  {
    // simpler to initiate state here
    // check item validity
    const _localuser: AuthResponseSchema = this.getUser();

    if (this.CheckAuth(_localuser)) {
      this.SetState(_localuser);
    } else {
      this.Logout(false);
    }
  }
  // shall move soon to state service
  SetState(item: AuthResponseSchema) {
    this.stateItem.next(item);
    return this.stateItem$;
  }
  UpdateState(item: Partial<AuthResponseSchema>) {
    const newItem = { ...this.stateItem.getValue(), ...item };
    this.stateItem.next(newItem);
    return this.stateItem$;
  }
  private removeState() {
    this.stateItem.next(null);
  }

  // localstorage related methods
  private saveUser(user: AuthResponseSchema) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private removeUser() {
    localStorage.removeItem('user');
  }

  private getUser(): AuthResponseSchema | null {
    const _localuser: AuthResponseSchema = JSON.parse(localStorage.getItem('user'));
    if (_localuser && _localuser.token) {
      return <AuthResponseSchema>_localuser;
    }
    return null;
  }

  // adding cookie saving methods
  private _SetCookie(user: AuthResponseSchema) {
    // save cookie with user, be selective in real life as to what to save in cookie
    let cookieStr =
      encodeURIComponent('CrCookie') +
      '=' +
      encodeURIComponent(JSON.stringify(user));

    // use expiration tp expire the cookie
    const dtExpires = new Date(user.expiresAt);

    cookieStr += ';expires=' + dtExpires.toUTCString();
    cookieStr += ';path=/';
    // some good security measures:
    cookieStr += ';samesite=lax';
    // when in production
    // cookieStr += ';secure';

    // be strong:
    document.cookie = cookieStr;
  }

  private _DeleteCookie(): void {
    // void accessToken but more importantly expire
    this._SetCookie({ token: '', expiresAt: 0 } as AuthResponseSchema);
  }

  // new saveSessions method
  public saveSession(user: AuthResponseSchema): AuthResponseSchema | null {
    if (user.token) {
      this.saveUser(user);
      this.SetState(user);
      return user;
    } else {
      // remove token from user
      this.removeUser();
      this.removeState();
      return null;
    }
  }

  UpdateSession(user: AuthResponseSchema) {
    const _localuser: AuthResponseSchema = this.getUser();
    if (_localuser) {
      // only set accesstoken and refreshtoken
      _localuser.accessToken = user.accessToken;
      _localuser.refreshToken = user.refreshToken;

      this.saveUser(_localuser);
      this.UpdateState(user);
    } else {
      // remove token from user
      this.removeUser();
      this.removeState();
    }
  }

  CheckAuth(user: AuthResponseSchema) {
    // if no user, or no accessToken, something terrible must have happened
    if (!user || !user.accessToken) {
      return false;
    }
    // if now is larger that expiresAt, it expired
    if (Date.now() > user.expiresAt) {
      return false;
    }

    return true;
  }

  // reroute optionally
  logout(reroute: boolean = false) {
    // remove leftover
    this.removeState();
    // and clean localstroage
    this.removeUser();

    if (reroute) {
      this.router.navigateByUrl('/public/login');
    }
  }

  public getToken() {
    const _auth = this.stateItem.getValue();
    // check if auth is still valid first before you return
    return this.CheckAuth(_auth) ? _auth.accessToken : null;
  }
}
