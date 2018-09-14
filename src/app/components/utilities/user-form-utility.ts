import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

import { constants } from '../../constants';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserFormUtility {
  permissionValues = Object.keys(constants.PERMISSIONS);

  constructor(
    private formBuilder: FormBuilder
  ) { }

  /**
   * Returns an array of form controls, one for each of the user permissions
   *
   * @param user
   *
   * @return FormControl[]
   */
  getFormPermissions(user: User): FormControl[] {
    return this.permissionValues.map((value) =>  {
      return this.formBuilder.control(user.permissions[value] === 'true');
    });
  }

  /**
   * Creates the user permissions object based on a array of boolean values
   * Each index of this array corresponds to a permission value in this.permissionValues
   *
   * @param form
   */
  getUserPermissionByForm(form: FormGroup) {
    let userPermissions = {};

    form.get('permissions').value.map((value, i) => {
      userPermissions[this.permissionValues[i]] = value.toString();
    });

    return userPermissions;
  }
}
