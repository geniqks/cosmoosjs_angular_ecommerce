import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialLoginModule,
  type SocialAuthServiceConfig,
} from "@abacritt/angularx-social-login";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthRoutingModule } from "./auth.routing.module";
import { AuthLayoutComponent } from "./components/auth-layout/auth-layout.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { LoginComponent } from "./components/login/login.component";
import { OtpComponent } from "./components/otp/otp.component";
import { RegisterComponent } from "./components/register/register.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";

const declarations = [
  AuthLayoutComponent,
  ForgotPasswordComponent,
  LoginComponent,
  OtpComponent,
  RegisterComponent,
  ResetPasswordComponent,
];

const primengImports = [
  ButtonModule,
  CheckboxModule,
  DividerModule,
  ImageModule,
  InputOtpModule,
  InputTextModule,
  PasswordModule,
  ProgressSpinnerModule,
];

const imported = [
  TranslateModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  GoogleSigninButtonModule,
  SocialLoginModule,
  AuthRoutingModule,
];

@NgModule({
  imports: [
    ...imported,
    ...primengImports,
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
              '310931651035-k3gahf31rm8q3k4f9pft4s5k99r3g284.apps.googleusercontent.com'
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  declarations: [
    ...declarations,
  ],
})
export class AuthModule { }
