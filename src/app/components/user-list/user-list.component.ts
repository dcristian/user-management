import {Component, EventEmitter, Input, Output} from '@angular/core';

import { User } from '../../models/user';
import { constants } from '../../constants';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  @Input() users: User[];
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  permissions = constants.PERMISSIONS;

  async onEdit(user: User): Promise<void> {
    await this.edit.emit(user);
  }

  async onDelete(user: User): Promise<void> {
    await this.delete.emit(user);
  }

  getUserPermissions(user: User): string {
    return Object.keys(user.permissions)
      .filter((p) => user.permissions[p] === 'true')
      .map((p) => this.permissions[p])
      .join(', ');
  }
}
