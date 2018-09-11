import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html'
})
export class UserModalComponent {
  @Input() user: User = new User();

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  onClose() {
    this.activeModal.close();
  }

  onSubmit(result: User) {
    this.activeModal.close(result);
  }
}
