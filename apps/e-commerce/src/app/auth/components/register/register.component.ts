import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/api/services';
import { handleFormValidation, validateInput } from 'src/app/shared/forms/helpers/form-validation.helper';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  protected form!: FormGroup;
  protected hidePassword!: boolean;
  protected validateInput = validateInput;
  protected apiAuthService = inject(AuthService);

  constructor(private authService: SocialAuthService) { }

  public ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
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
    // Lorsque l'utilisateur ce connecte avec google
    // Vérifier si il existe dans la bdd sinon le créer
    // Le connecter
  }

  private handleLocalRegister() {
    console.log('handleLocalRegister');
    this.apiAuthService.authRegisterPost({
      body: {
        email: this.form.get('email')?.value,
        lastname: this.form.get('lastname')?.value,
        name: this.form.get('firstname')?.value,
        password: this.form.get('password')?.value,
        username: this.form.get('username')?.value
      }
    }).subscribe((data) => {
      console.log('data');
      console.log(data);

    })
    // Lorsque l'utilisateur ce connecte avec email et mot de passe
    // Lancer la logique habituelle d'une connexion
  }
}