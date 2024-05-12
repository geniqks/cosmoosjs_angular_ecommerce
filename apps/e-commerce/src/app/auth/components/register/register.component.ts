import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { HttpResponse } from "@angular/common/http";
import { Component, inject, type OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@app/api/services";
import { WebsocketService } from "@app/shared/websockets/services/websocket.service";
import { TranslateService } from "@ngx-translate/core";
import { EmailValidator } from '@shared/validators/email.validator';
import { MessageService } from "primeng/api";

@Component({
  selector: "app-auth-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  protected form!: FormGroup;
  protected isLoading!: boolean;
  protected passwordMinLength = 8;
  protected apiAuthService = inject(AuthService);
  protected authService = inject(SocialAuthService)
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);
  private websocketService = inject(WebsocketService);

  public ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log(user)
      this.handleGoogleRegister(user);
    });
    this.initForm();
  }

  protected get password(): string {
    return this.form.get('password')?.value;
  }

  private initForm() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(EmailValidator.pattern)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      hasReadContracts: new FormControl(false, Validators.requiredTrue),
      enablePromotionalMails: new FormControl(false),
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      this.handleLocalRegister()
    }
  }

  public isUsernameAvailable(event: Event): void {
    const typedEvent = event.target as HTMLInputElement;
    if (typedEvent.value) {
      this.websocketService.send({ event: 'user_exist', data: typedEvent.value });
      this.websocketService.messages.subscribe((response) => {
        console.log('response', response)
        console.log(this.form.get('username')?.errors);
        if (response) {
          this.form.get('username')?.setErrors({ usernameExist: true });
        }
        this.form.updateValueAndValidity();
      });
    }
  }

  private handleGoogleRegister(user: SocialUser) {
    this.apiAuthService.authRegisterPost({
      body: {
        email: user.email,
        lastname: user.lastName ?? '',
        name: user.firstName,
        password: Math.random().toString(36).slice(-8),
        username: `${user.firstName?.toLocaleLowerCase()}.${user.lastName?.toLocaleLowerCase()}.${Math.random().toString(36).slice(-4)}`
      }
    }).subscribe({
      next: (data) => {
        console.log('data');
        console.log(data);
        this.translateService.get('auth.registerSuccess').subscribe((res: string) => {
          console.log(res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res });
        });
      },
      error: (error: HttpResponse<SocialUser>) => {
        console.log('error');
        console.log(error);
        if (error.status === 409) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    },
    )
  }

  private handleLocalRegister() {
    this.isLoading = true;
    console.log('handleLocalRegister');
    this.apiAuthService.authRegisterPost({
      body: {
        email: this.form.get('email')?.value,
        lastname: this.form.get('lastname')?.value,
        name: this.form.get('firstname')?.value,
        password: this.form.get('password')?.value,
        username: this.form.get('username')?.value
      }
    }).subscribe({
      next: (data) => {
        this.translateService.get('registerSuccess').subscribe((res: string) => {
          console.log(res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res });
        });
      },
      error: (error: HttpResponse<any>) => {
        console.log('error');
        console.log(error);
        if (error.status === 409) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }
}
