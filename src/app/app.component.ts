import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { UserService } from './services/user.service';
import { UserFormModalComponent } from './components/user-form-modal/user-form-modal.component';
import { User } from './models/user';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  users: User[] = [];

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
    let data = await this.openUserFormModal(new User());
    if (!data) {
      return;
    }

    let response = await this.userService.post(data);
    this.displaySuccessNotification(response.messages.success);

    await this.loadUsers();
  }

  async onEdit(user: User): Promise<void> {
    let data = await this.openUserFormModal(user, true);
    if (!data) {
      return;
    }

    let title = 'Update confirmation';
    let message = 'Are you sure you want to update this user?';

    let result = await this.openConfirmationModal(title, message);
    if (!result) {
      return;
    }

    let response = await this.userService.put(data.id, data);
    this.displaySuccessNotification(response.messages.success);

    await this.loadUsers();
  }

  async onDelete(user: User): Promise<void> {
    let title = 'Delete confirmation';
    let message = 'Are you sure you want to delete this user?';

    let result = await this.openConfirmationModal(title, message);
    if (!result) {
      return;
    }

    let response = await this.userService.delete(user.id);
    this.displaySuccessNotification(response.messages.success);

    await this.loadUsers();
  }

  private async openUserFormModal(user: User, editMode = false): Promise<User> {
    const modal = this.modalService.open(UserFormModalComponent, {
      keyboard: false,
      backdrop: 'static'
    });
    modal.componentInstance.user = user;
    modal.componentInstance.editMode = editMode;

    return await modal.result;
  }

  private async openConfirmationModal(title, message): Promise<boolean> {
    const modal = this.modalService.open(ConfirmationModalComponent, {
      keyboard: false,
      backdrop: 'static'
    });
    modal.componentInstance.title = title;
    modal.componentInstance.message = message;

    return await modal.result;
  }

  private displaySuccessNotification(message): void {
    this.toastr.success(message, '', {
      closeButton: true,
      tapToDismiss: false
    });
  }
}
