import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmedValidator} from './validators';

export const getUserFormControlConfig = ({displayName, email, type},
                                         {showAll, withTypeSelection, withPassword, withEmail, withName, withPasswordConfirmation}: any,
                                         formControlOptions) => {
  const formData: any = {};
  if (withTypeSelection) {
    formData.type =
      new FormControl(type, [Validators.required]);
  }
  if (withName) {
    formData.displayName =
      new FormControl(displayName, Validators.required);
  }
  if (withEmail) {
    formData.email =
      new FormControl(email, [Validators.required, Validators.email]);
  }
  if (withPassword) {
    formData.password = new FormControl('', [
      Validators.required, Validators.minLength(6)/*, Validators.pattern(strongPasswordPattern)*/]);
  }
  if (withPasswordConfirmation) {
    formData.confirmPassword = new FormControl('', [
      Validators.required, Validators.minLength(6)/*, Validators.pattern(strongPasswordPattern)*/]);
  }
  return new FormGroup(formData, formControlOptions);
};
export const userFormControlOptions = {
  validator: ConfirmedValidator('password', 'confirmPassword')
};

export const defaultOptions = {
  showAll: false,
  withPasswordConfirmation: false,
  withEmail: true,
  withName: true,
  withPassword: false,
  noValidate: false,
  withTypeSelection: true
};
export const allSetOptions = Object.keys(defaultOptions).reduce((acc, key) => ({[key]: true, ...acc}), {});
