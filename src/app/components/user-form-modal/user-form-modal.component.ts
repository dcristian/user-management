import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { User } from '../../models/user';
import { constants } from '../../constants';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-form-modal.component.html'
})
export class UserFormModalComponent implements OnInit {
  @Input() user: User = new User();
  @Input() editMode = false;

  form: FormGroup;
  permissions = constants.USER_PERMISSIONS;
  minBirthDate: NgbDate = new NgbDate(1900, 1, 1);
  maxBirthDate: NgbDate = this.getMaxBirthDate();

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    const permissions = this.permissions.map((permission) => {
      const hasPermission = this.user.permissions[permission.value] === 'true';
      return this.formBuilder.control(hasPermission);
    });
    let birthdate = null;
    if (this.user.birthdate) {
      let momentObj = moment(this.user.birthdate, 'YYYY-MM-DD');
      birthdate = new NgbDate(momentObj.year(), momentObj.month() + 1, momentObj.date());
    }

    this.form = this.formBuilder.group({
      'firstname': [
        this.user.firstname,
        Validators.required
      ],
      'lastname': [
        this.user.lastname,
        Validators.required
      ],
      'email': [
        this.user.email.trim(),
        [
          Validators.required,
          Validators.email
        ]
      ],
      'birthdate': [
        '',
        Validators.required
      ],
      'active': [
        this.user.active === 'true',
        Validators.required
      ],
      'permissions': this.formBuilder.array(permissions)
    });

    this.form.get('birthdate').patchValue(birthdate);
  }

  getMaxBirthDate(): NgbDate {
    let today = moment();

    return new NgbDate(today.year(), today.month() + 1, today.day());
  }

  onClose() {
    this.activeModal.close();
  }

  onReset() {
    this.form.reset();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    let birthDateValue = this.form.get('birthdate').value;
    birthDateValue.month -= 1;
    let birthdate = moment(birthDateValue).format('YYYY-MM-DD');
    let permissions = {};
    this.form.get('permissions').value.map((value, i) => {
      permissions[this.permissions[i].value] = value.toString();
    });

    let user = new User();
    user.id = this.user.id;
    user.firstname = this.form.get('firstname').value;
    user.lastname = this.form.get('lastname').value;
    user.email = this.form.get('email').value.trim();
    user.birthdate = birthdate;
    user.active = this.form.get('active').value.toString();
    user.permissions = permissions;

    this.activeModal.close(user);
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
}
