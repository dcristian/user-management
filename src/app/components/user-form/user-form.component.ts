import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { constants } from '../../constants';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  @Input() user: User = new User();
  @Output() submit = new EventEmitter();

  form: FormGroup;
  permissions = constants.USER_PERMISSIONS;
  minBirthDate: NgbDate = new NgbDate(1900, 1, 1);
  maxBirthDate: NgbDate = this.getMaxBirthDate();

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const permissions = this.permissions.map(() => this.formBuilder.control(false));

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
        this.user.email,
        [
          Validators.required,
          Validators.email
        ]
      ],
      'birthdate': [
        this.user.birthdate,
        Validators.required
      ],
      'active': [
        this.user.birthdate || false,
        Validators.required
      ],
      'permissions': this.formBuilder.array(permissions)
    });
  }

  getMaxBirthDate(): NgbDate {
    let today = moment();

    return new NgbDate(today.year(), today.month(), today.day());
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    let birthdate = moment(this.form.get('birthdate').value).format('YYYY-MM-DD');
    let permissions = {};
    this.form.get('permissions').value.map((value, i) => {
      permissions[this.permissions[i].value] = value.toString();
    });

    let user = new User();
    user.firstname = this.form.get('firstname').value;
    user.lastname = this.form.get('lastname').value;
    user.email = this.form.get('email').value;
    user.birthdate = birthdate;
    user.active = this.form.get('active').value.toString();
    user.permissions = permissions;

    this.submit.emit(user);
  }
}
