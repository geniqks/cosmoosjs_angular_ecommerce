import { FormGroup } from "@angular/forms";

/** Handle boostrap form validtion https://getbootstrap.com/docs/5.2/forms/validation/#custom-styles  */
export function handleFormValidation(formGroup: FormGroup) {
  let form = document.querySelector('form') as HTMLFormElement;
  form.addEventListener('submit', (submitEvent: SubmitEvent) => {
    if (!formGroup.valid || !form.checkValidity()) {
      submitEvent.preventDefault();
      submitEvent.stopPropagation();
    }

    form.classList.add('was-validated');
  });
}


/** Validate custom input with bootstrap https://stackblitz.com/edit/stackblitz-starters-eatu8b?file=src/main.ts */
export function validateInput(form: FormGroup, controlName: string, field: HTMLInputElement) {
  if (form.controls[controlName].errors) {
    for (let error in form.controls[controlName].errors) {
      const customField = form.controls[controlName];
      if (customField.errors) {
        field.setCustomValidity(
          customField.errors[error]
        );
      }
    }
  } else {
    field.setCustomValidity('');
  }
}