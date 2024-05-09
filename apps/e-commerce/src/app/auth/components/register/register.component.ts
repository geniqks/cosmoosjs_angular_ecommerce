import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/api/services';
import { handleFormValidation, validateInput } from 'src/app/shared/bootstrap/forms/helpers/form-validation.helper';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  protected form!: FormGroup;
  protected hidePassword!: boolean;
  protected validateInput = validateInput;
  protected apiAuthService = inject(AuthService);
  protected isLoading!: boolean

  constructor(
    private authService: SocialAuthService,
    private toastr: ToastrService
  ) { }

  public ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log('cc')
      this.handleGoogleRegister(user)
    });
    this.initForm();
  }

  protected onSubmit() {
    if (this.form.valid) {
      this.handleLocalRegister();
      console.log(':D')
    } else {
      console.log(this.form)
      console.log(':c')
    }
  }

  protected togglePasswordSwitch() {
    this.hidePassword = !this.hidePassword;
  }

  private initForm() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    handleFormValidation(this.form);
  }

  private handleGoogleRegister(user: SocialUser) {
    this.apiAuthService.authRegisterPost({
      body: {
        email: user.email,
        lastname: user.lastName ?? '',
        name: user.firstName,
        password: Math.random().toString(36).slice(-8),
        username: `${user.firstName?.toLocaleLowerCase()}.${user.lastName?.toLocaleLowerCase()}`
      }
    }).subscribe({
      next: (data) => {
        console.log('data');
        console.log(data);
        this.toastr.success('Inscription valide redirection dans 5s', 'Ouiiiii');
      },
      error: (error: HttpResponse<SocialUser>) => {
        console.log('error');
        console.log(error);
        if (error.status === 409) {
          this.toastr.error('Email already exists', 'Error');
        } else {
          this.toastr.error(error.statusText, 'Error');
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
        console.log('data');
        console.log(data);
        this.toastr.success('Inscription valide redirection dans 5s', 'Ouiiiii');
      },
      error: (error: HttpResponse<any>) => {
        console.log('error');
        console.log(error);
        if (error.status === 409) {
          this.toastr.error('Une erreur est survenu lors de l inscription', 'Error');
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
    // Lorsque l'utilisateur ce connecte avec email et mot de passe
    // Lancer la logique habituelle d'une connexion
  }
}