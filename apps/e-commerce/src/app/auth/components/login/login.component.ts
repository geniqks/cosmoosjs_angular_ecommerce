import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  protected fieldTextType!: boolean;

  constructor(private authService: SocialAuthService) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log(user)
    });

    // Lorsque l'utilisateur ce connecte avec google
    // Vérifier si il existe dans la bdd sinon le créer
    // Le connecter

    // Lorsque l'utilisateur ce connecte avec email et mot de passe
    // Lancer la logique habituelle d'une connexion
  }

  /**
   * Password Hide/Show
  */
  protected toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}