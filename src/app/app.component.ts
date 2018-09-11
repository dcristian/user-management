import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { UserService } from './services/user.service';
import { UserFormModalComponent } from './components/user-form-modal/user-form-modal.component';
import { User } from './models/user';
import { constants } from './constants';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

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
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.users = await this.userService.getAll();
  }

  async addNewUser(): Promise<void> {
    let data = await this.modalService.open(UserFormModalComponent, {
      keyboard: false,
      backdrop: 'static'
    }).result;

    if (!data) {
      return;
    }

    let response = await this.userService.post(data);
    this.toastr.success(response.messages.success, '', {
      closeButton: true,
      tapToDismiss: false
    });
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
    const modal = this.modalService.open(UserFormModalComponent, {
      keyboard: false,
      backdrop: 'static'
    });
    modal.componentInstance.user = user;
    modal.componentInstance.editMode = true;

    let data = await modal.result;
    if (!data) {
      return;
    }

    const confirmationModal = this.modalService.open(ConfirmationModalComponent, {
      keyboard: false,
      backdrop: 'static'
    });
    confirmationModal.componentInstance.title = 'Update confirmation';
    confirmationModal.componentInstance.message = 'Are you sure you want to update this user?';

    let result = await confirmationModal.result;
    if (!result) {
      return;
    }

    let response = await this.userService.put(data.id, data);
    this.toastr.success(response.messages.success, '', {
      closeButton: true,
      tapToDismiss: false
    });
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

    let response = await this.userService.delete(user.id);
    this.toastr.success(response.messages.success, '', {
      closeButton: true,
      tapToDismiss: false
    });
    await this.loadUsers();
  }
}
