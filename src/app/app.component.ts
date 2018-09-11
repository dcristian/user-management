import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from './services/user.service';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { User } from './models/user';
import { constants } from './constants';
import {ConfirmationModalComponent} from './components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  users: User[] = [];
  permissions = constants.USER_PERMISSIONS;

  constructor(
    private userService: UserService,
    private modalService: NgbModal
  ) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.users = await this.userService.getAll();
  }

  async addNewUser(): Promise<void> {
    let data = await this.modalService.open(UserModalComponent, {
      keyboard: false,
      backdrop: 'static',
      size: 'lg'
    }).result;

    if (!data) {
      return;
    }

    await this.userService.post(data);
    await this.loadUsers();
  }

  getUserPermissions(user: User) {
    let permissions = [];
    for (let p in user.permissions) {
      if (!user.permissions.hasOwnProperty(p) || user.permissions[p] !== 'true') {
        continue;
      }

      permissions.push(this.permissions.find((perm) => perm.value === p).name);
    }

    return permissions.join(', ');
  }

  async onEdit(user: User) {
    const modal = this.modalService.open(UserModalComponent, {
      keyboard: false,
      backdrop: 'static',
      size: 'lg'
    });
    modal.componentInstance.user = user;

    let data = await modal.result;
    if (!data) {
      return;
    }

    await this.userService.put(data.id, data);
    await this.loadUsers();
  }

  async onDelete(user: User) {
    const modal = this.modalService.open(ConfirmationModalComponent, {
      keyboard: false,
      backdrop: 'static'
    });
    modal.componentInstance.title = 'Delete confirmation';
    modal.componentInstance.message = 'Are you sure you want to delete this user?';

    let result = await modal.result;
    if (!result) {
      return;
    }

    await this.userService.delete(user.id);
    await this.loadUsers();
  }
}
