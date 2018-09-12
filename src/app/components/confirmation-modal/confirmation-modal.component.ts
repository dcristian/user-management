import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html'
})
export class ConfirmationModalComponent {
  @Input() title: string;
  @Input() message: string;

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  onClose() {
    this.activeModal.close();
  }

  onCancel() {
    this.activeModal.close(false);
  }

  onConfirm() {
    this.activeModal.close(true);
  }
}
