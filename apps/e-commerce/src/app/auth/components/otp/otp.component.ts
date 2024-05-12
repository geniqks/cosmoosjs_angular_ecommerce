import { GoogleLoginProvider, SocialAuthService } from "@abacritt/angularx-social-login";
import { Component, type OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

// Bloquer le compte après 5 tentatives de connexion

@Component({
  selector: "app-auth-otp",
  templateUrl: "./otp.component.html",
})
export class OtpComponent implements OnInit {
  protected form!: FormGroup;
  protected isLoading!: boolean;
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
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
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
