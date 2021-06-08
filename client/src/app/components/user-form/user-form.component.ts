import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {userTypes} from '../../utils/constants';
import {User} from '../../utils/models';
import {FormBuilder} from '@angular/forms';
import {emptyUser} from '../../utils/empty-user';
import {allSetOptions, defaultOptions, getUserFormControlConfig, userFormControlOptions} from '../../utils/forms-utils';

type FieldsOptions =
  'withPasswordConfirmation' | 'showAll' | 'withEmail' | 'withName' | 'withPassword' | 'noValidate' | 'withTypeSelection';

@Component({
  selector: 'rr-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Output() submitData = new EventEmitter();
  @Output() editData = new EventEmitter();
  @Input() options: Partial<Record<FieldsOptions, boolean>> = defaultOptions;
  @Input() userData: User = emptyUser;
  types = userTypes;
  form;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const options = this.options.showAll ? allSetOptions : this.options;
    const formControlOptions = this.options.withPasswordConfirmation ? userFormControlOptions : {};
    this.form = getUserFormControlConfig(this.userData, options, formControlOptions);
    this.form.valueChanges.subscribe(this.editData);
  }

}
