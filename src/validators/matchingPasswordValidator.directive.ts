import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const matchingPasswordValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const repeat = control.get('repeat')?.value;
    
    return password !== repeat
      ? { missMatchPassword: true }
      : null;
  };