import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { User } from '../../models/user';
import { constants } from '../../constants';

@Component({
  selector: 'app-user-permission-form-modal',
  templateUrl: './user-permissions-form-modal.component.html'
})
export class UserPermissionsFormModalComponent implements OnInit {
  @Input() user: User = new User();
  @Input() editMode = false;

  form: FormGroup;
  permissionValues = Object.keys(constants.PERMISSIONS);
  permissionNames = Object.values(constants.PERMISSIONS);

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  onClose() {
    this.activeModal.close();
  }

  onSubmit() {
    const user = this.createUserByForm();

    this.activeModal.close(user);
  }

  get formPermissions(): FormArray {
    return <FormArray>this.form.get('permissions');
  }

  private buildForm(): void {
    const permissions = this.permissionValues.map((value) =>  {
      return this.formBuilder.control(this.user.permissions[value] === 'true');
    });

    this.form = this.formBuilder.group({
      'permissions': this.formBuilder.array(permissions)
    });
  }

  private createUserByForm(): User {
    let userPermissions = {};
    this.form.get('permissions').value.map((value, i) => {
      userPermissions[this.permissionValues[i]] = value.toString();
    });

    let user = _.cloneDeep(this.user);
    user.permissions = userPermissions;

    return user;
  }
}
