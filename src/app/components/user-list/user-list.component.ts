import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';

import { User } from '../../models/user';
import { constants } from '../../constants';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnChanges {
  @Input() users: User[];
  @Output() modifyUser = new EventEmitter();
  @Output() editUserPermissions = new EventEmitter();
  @Output() delete = new EventEmitter();

  filteredUsers: User[];
  permissions = constants.PERMISSIONS;
  tableSizes = [10, 25, 50, 100];
  pages = [];
  currentPage: User[] = [];
  pageSize = this.tableSizes[0];
  pageNumber = 1;
  emailSearchBox = '';
  statusSelect = '';
  sortDetails = {
    sortColumn: 'firstname',
    sortDirection: 'asc'
  };

  ngOnInit() {
    this.calculateCurrentPage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['users']) {
      this.calculateCurrentPage();
    }
  }

  async onModifyUser(user: User): Promise<void> {
    await this.modifyUser.emit(user);
  }

  async onEditUserPermissions(user: User): Promise<void> {
    await this.editUserPermissions.emit(user);
  }

  async onDelete(user: User): Promise<void> {
    await this.delete.emit(user);
  }

  onMaxSizeChange() {
    this.calculateCurrentPage();
  }

  onPageChange() {
    this.currentPage = this.pages[this.pageNumber - 1];
  }

  onSearchByEmail() {
    this.calculateCurrentPage();
  }

  onStatusChange() {
    this.calculateCurrentPage();
  }

  onSort(column: string) {
    let direction = this.getNewSortDirection(column);
    this.sortDetails = {
      sortColumn: column,
      sortDirection: direction
    };

    this.calculateCurrentPage();
  }

  getUserPermissions(user: User): string {
    return Object.keys(user.permissions)
      .filter((p) => user.permissions[p] === 'true')
      .map((p) => this.permissions[p])
      .join(', ');
  }

  private calculateCurrentPage(): void {
    // apply the filters
    this.filteredUsers = this.users.filter((user) => {
      return (!this.emailSearchBox || _.includes(user.email, this.emailSearchBox))
        && (!this.statusSelect || user.active === this.statusSelect.toString());
    });

    // sort the list
    this.filteredUsers = this.sortDetails.sortDirection === 'asc' ?
      _.sortBy(this.filteredUsers, this.sortDetails.sortColumn) :
      _.sortBy(this.filteredUsers, this.sortDetails.sortColumn).reverse();

    // split the list into pages
    this.pages = _.chunk(this.filteredUsers, this.pageSize);

    // get the current page
    this.currentPage = this.pages[this.pageNumber - 1];
  }

  private getNewSortDirection(column: string) {
    if (column !== this.sortDetails.sortColumn) {
      return 'asc';
    }

    if (this.sortDetails.sortDirection === 'asc') {
      return 'desc';
    }

    return 'asc';
  }
}
