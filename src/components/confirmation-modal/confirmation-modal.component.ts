import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Input()
  text?: string;

  constructor(
    private modalService: NgbActiveModal
  ) {}

  dismiss(): void {
    this.modalService.dismiss();
  }

  close(): void {
    this.modalService.close();
  }
}
