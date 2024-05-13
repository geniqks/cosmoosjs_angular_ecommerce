import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, inject, type OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@app/api/services";
import { SubscriptionManager } from "@app/shared/subscription/services/subscription-manager.service";
import { WebsocketService } from "@app/shared/websockets/services/websocket.service";
import { TranslateService } from "@ngx-translate/core";
import { ISocketReceivedMessage } from "@packages/types";
import { EmailValidator } from '@shared/validators/email.validator';
import { MessageService } from "primeng/api";

@Component({
  selector: "app-auth-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent extends SubscriptionManager implements OnInit, OnDestroy {
  protected form!: FormGroup;
  protected isLoading!: boolean;
  protected passwordMinLength = 8;
  protected apiAuthService = inject(AuthService);
  protected authService = inject(SocialAuthService)
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);
  private websocketService = inject(WebsocketService);

  public ngOnInit(): void {
    this.subscriptions.push(this.authService.authState.subscribe((user) => {
      this.handleGoogleRegister(user);
    }));
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

  protected isUsernameAvailable(event: Event): void {
    this.availableHelper(event, 'username', 'usernameExist');
  }

  protected isEmailAvailable(event: Event): void {
    this.availableHelper(event, 'email', 'emailIsTaken');
  }

  private availableHelper(event: Event, controlName: string, errorName: string): void {
    const typedEvent = event.target as HTMLInputElement;
    if (typedEvent.value) {
      this.websocketService.send<ISocketReceivedMessage>(
        {
          event: 'user_exist',
          data: {
            control: controlName,
            value: typedEvent.value
          }
        }
      );
      this.websocketService.messages.subscribe(response => {
        if (response && response.source === 'user_exist') {
          if (response.control === controlName) {
            if (response.value) {
              this.form.get(controlName)?.setErrors({ [errorName]: true });
            } else {
              this.form.get(controlName)?.setErrors(null);
            }
          }
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
      next: () => {
        this.translateService.get('auth.registerSuccess').subscribe((res: string) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res });
        });
      },
      error: (error: HttpResponse<SocialUser>) => {
        if (error.status === 409) {
          this.translateService.get('auth.conflict').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res });
          });
        } else {
          this.translateService.get('validation.anErrorOccurred').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res });
          });
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleLocalRegister() {
    this.isLoading = true;
    this.apiAuthService.authRegisterPost({
      body: {
        email: this.form.get('email')?.value,
        lastname: this.form.get('lastname')?.value,
        name: this.form.get('firstname')?.value,
        password: this.form.get('password')?.value,
        username: this.form.get('username')?.value
      }
    }).subscribe({
      next: () => {
        this.translateService.get('auth.registerSuccess').subscribe((res: string) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res });
        });
      },
      error: (error: HttpResponse<SocialUser>) => {
        if (error.status === 409) {
          this.translateService.get('auth.conflict').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res });
          });
        } else {
          this.translateService.get('validation.anErrorOccurred').subscribe((res: string) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res });
          });
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }
}
