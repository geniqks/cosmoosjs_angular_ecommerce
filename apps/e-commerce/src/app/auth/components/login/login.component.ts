import { SocialAuthService } from "@abacritt/angularx-social-login";
import { HttpResponse } from "@angular/common/http";
import { Component, inject, type OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthLoginInputSchema } from "@app/api/models";
import { AuthService } from "@app/api/services";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-auth-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  protected form!: FormGroup;
  protected apiAuthService = inject(AuthService);
  protected authService = inject(SocialAuthService)
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);

  public ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.handleLogin({
        username: user.email,
        googleIdToken: user.idToken,
        googleClientId: user.id,
      });
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
      this.handleLogin({
        username: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
      })
    }
  }

  private handleLogin(body?: AuthLoginInputSchema) {
    this.apiAuthService.authLoginPost({
      body,
    }).subscribe({
      next: () => {
        // redirect to /
      },
      error: (error: HttpResponse<unknown>) => {
        console.error(error);
        this.translateService.get('validation.anErrorOccurred').subscribe((res: string) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res });
        });
      }
    })
  }
}
