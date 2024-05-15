/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { AuthResponseSchema } from '../models/auth-response-schema';
import { userMeGet } from '../fn/user/user-me-get';
import { UserMeGet$Params } from '../fn/user/user-me-get';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `userMeGet()` */
  static readonly UserMeGetPath = '/user/me';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `userMeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  userMeGet$Response(params?: UserMeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthResponseSchema>> {
    return userMeGet(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `userMeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  userMeGet(params?: UserMeGet$Params, context?: HttpContext): Observable<AuthResponseSchema> {
    return this.userMeGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<AuthResponseSchema>): AuthResponseSchema => r.body)
    );
  }

}
