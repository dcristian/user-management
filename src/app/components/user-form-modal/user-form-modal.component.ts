import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDate, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { User } from '../../models/user';
import { constants } from '../../constants';

@Component({
  selector: 'user-modal',
  templateUrl: './user-form-modal.component.html',
  providers: [{
    provide: NgbDateAdapter,
    useClass: NgbDateNativeAdapter
  }]
})
export class UserFormModalComponent implements OnInit {
  @Input() user: User = new User();
  @Input() editMode = false;

  readonly ONLY_LETTERS_PATTERN = /^[a-zA-Z]+$/;

  form: FormGroup;
  permissionValues = Object.keys(constants.PERMISSIONS);
  permissionNames = Object.values(constants.PERMISSIONS);
  minBirthDate: NgbDate = new NgbDate(1900, 1, 1);
  maxBirthDate: NgbDate = this.getMaxBirthDate();

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  get firstname(): AbstractControl {
    return this.form.get('firstname');
  }

  get lastname(): AbstractControl {
    return this.form.get('lastname');
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get birthdate(): AbstractControl {
    return this.form.get('birthdate');
  }

  get formPermissions(): FormArray {
    return <FormArray>this.form.get('permissions');
  }

  onClose() {
    this.activeModal.close();
  }

  onReset() {
    const permissions = this.permissionValues.map((value) =>  {
      return this.user.permissions[value] === 'true';
    });

    this.form.reset({
      permissions: permissions
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const user = this.createUserByForm();

    this.activeModal.close(user);
  }

  private getMaxBirthDate(): NgbDate {
    let today = new Date();

    return new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDay());
  }

  private buildForm(): void {
    const permissions = this.permissionValues.map((value) =>  {
      return this.formBuilder.control(this.user.permissions[value] === 'true');
    });

    this.form = this.formBuilder.group({
      'firstname': [
        this.user.firstname.trim(),
        [
          Validators.required,
          Validators.pattern(this.ONLY_LETTERS_PATTERN)
        ]
      ],
      'lastname': [
        this.user.lastname.trim(),
        [
          Validators.required,
          Validators.pattern(this.ONLY_LETTERS_PATTERN)
        ]
      ],
      'email': [
        this.user.email.trim(),
        [
          Validators.required,
          Validators.email
        ]
      ],
      'birthdate': [
        new Date(this.user.birthdate),
        Validators.required
      ],
      'active': [
        this.user.active === 'true',
        Validators.required
      ],
      'permissions': this.formBuilder.array(permissions)
    });
  }

  private createUserByForm(): User {
    let userPermissions = {};
    this.form.get('permissions').value.map((value, i) => {
      userPermissions[this.permissionValues[i]] = value.toString();
    });

    let user = new User();
    user.id = this.user.id;
    user.firstname = this.form.get('firstname').value.trim();
    user.lastname = this.form.get('lastname').value.trim();
    user.email = this.form.get('email').value.trim();
    user.birthdate = moment(this.form.get('birthdate').value).format('YYYY-MM-DD');
    user.active = this.form.get('active').value.toString();
    user.permissions = userPermissions;

    return user;
  }
}
