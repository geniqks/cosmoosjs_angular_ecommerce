import { SocialAuthService } from "@abacritt/angularx-social-login";
import { Component, type OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EmailValidator } from "@app/shared/validators/email.validator";

@Component({
  selector: "app-auth-forgot-password",
  templateUrl: "./forgot-password.component.html",
})
export class ForgotPasswordComponent implements OnInit {
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
      email: new FormControl('', [Validators.required, Validators.pattern(EmailValidator.pattern)]),
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
}
