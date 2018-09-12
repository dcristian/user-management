import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';

import { User } from '../../models/user';
import { constants } from '../../constants';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit, OnChanges {
  @Input() users: User[];
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  permissions = constants.PERMISSIONS;
  tableSizes = [10, 25, 50, 100];
  pages = [];
  currentPage: User[] = [];
  pageSize = this.tableSizes[0];
  pageNumber = 1;

  ngOnInit() {
    this.setPages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['users']) {
      this.setPages();
    }
  }

  async onEdit(user: User): Promise<void> {
    await this.edit.emit(user);
  }

  async onDelete(user: User): Promise<void> {
    await this.delete.emit(user);
  }

  onMaxSizeChange() {
    this.setPages();
  }

  onPageChange() {
    this.currentPage = this.pages[this.pageNumber - 1];
  }

  getUserPermissions(user: User): string {
    return Object.keys(user.permissions)
      .filter((p) => user.permissions[p] === 'true')
      .map((p) => this.permissions[p])
      .join(', ');
  }

  setPages(): void {
    this.pages = _.chunk(this.users, this.pageSize);
    this.currentPage = this.pages[this.pageNumber - 1];
  }
}
