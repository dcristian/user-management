import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { User } from '../../models/user';
import { constants } from '../../constants';
import { UserFormUtility } from '../utilities/user-form-utility';

@Component({
  selector: 'app-user-permission-form-modal',
  templateUrl: './user-permissions-form-modal.component.html'
})
export class UserPermissionsFormModalComponent implements OnInit {
  @Input() user: User = new User();
  @Input() editMode = false;

  form: FormGroup;
  permissionNames = Object.values(constants.PERMISSIONS);

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userFormUtility: UserFormUtility
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
    const permissions = this.userFormUtility.getFormPermissions(this.user);

    this.form = this.formBuilder.group({
      'permissions': this.formBuilder.array(permissions)
    });
  }

  private createUserByForm(): User {
    let user = _.cloneDeep(this.user);
    user.permissions = this.userFormUtility.getUserPermissionByForm(this.form);

    return user;
  }
}
