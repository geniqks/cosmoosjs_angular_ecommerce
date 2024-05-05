import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthRoutingModule } from './auth.routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';

const declarations = [
  AuthLayoutComponent,
  LoginComponent,
  RegisterComponent,
];

// TODO: add client id to environment
@NgModule({
  imports: [
    CommonModule,
    GoogleSigninButtonModule,
    SocialLoginModule,
    AuthRoutingModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.google.clientId
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  declarations: [...declarations]
})
export class AuthModule { }