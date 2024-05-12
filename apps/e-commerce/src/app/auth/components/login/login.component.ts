import { GoogleLoginProvider, SocialAuthService } from "@abacritt/angularx-social-login";
import { Component, type OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-auth-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  protected form!: FormGroup;
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
