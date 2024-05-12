import { GoogleLoginProvider, SocialAuthService } from "@abacritt/angularx-social-login";
import { Component, type OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

// Mettre en place un token temporaire qui sera dans la query de l'url pour rénitiliser le mot de passe
// Ce token sera obligatoire pour que le back end puisse réinitialiser le mot de passe

@Component({
  selector: "app-auth-reset-password",
  templateUrl: "./reset-password.component.html",
})
export class ResetPasswordComponent implements OnInit {
  protected form!: FormGroup;
  protected passwordMinLength = 8;
  constructor(private authService: SocialAuthService) { }

  public ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log(user);
    });
    this.initForm();
  }

  protected get password(): string {
    return this.form.get('password')?.value;
  }

  private initForm() {
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinLength)]),
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted');
      console.log(this.form.value);
    } else {
      console.log('Form not submitted');
    }
  }

  private signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
