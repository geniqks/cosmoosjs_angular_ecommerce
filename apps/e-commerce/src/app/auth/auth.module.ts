import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormModule } from '../shared/bootstrap/forms/form.module';
import { AuthRoutingModule } from './auth.routing.module';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const declarations = [
  AuthLayoutComponent,
  LoginComponent,
  RegisterComponent,
];

const imported = [
  CommonModule,
  FormModule,
  GoogleSigninButtonModule,
  SocialLoginModule,
  AuthRoutingModule,
];


// TODO: add client id to environment
@NgModule({
  imports: [
    ...imported
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