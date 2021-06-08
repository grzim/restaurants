import {FormGroup} from '@angular/forms';
import {User} from './models';

export const ConfirmedValidator = (controlName: string, matchingControlName: string) => (formGroup: FormGroup) => {
  const control = formGroup.controls[controlName];
  const matchingControl = formGroup.controls[matchingControlName];
  if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
    return;
  }
  if (control.value !== matchingControl.value) {
    matchingControl.setErrors({confirmedValidator: true});
  } else {
    matchingControl.setErrors(null);
  }
};

export const isAdmin = ({type}: (User | {type: string} ) = {type: ''}) => type === 'Admin';
export const isOwner = ({type}: (User | {type: string} ) = {type: ''}) => type === 'Owner';
