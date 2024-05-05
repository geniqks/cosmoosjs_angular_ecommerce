import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  fieldTextType!: boolean;

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}