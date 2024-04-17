import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISandbox } from 'src/model/sandbox.model';
import { FormatDate } from 'src/Pipes/FormatDate.pipe';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalSandboxComponent } from './modal-sandbox/modal-sandbox.component';
import { UserService } from 'src/services/user.service';
import { SandboxService } from 'src/services/sandbox.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-sandboxes',
  standalone: true,
  imports: [CommonModule, FormatDate, NgbModule],
  templateUrl: './sandboxes.component.html',
  styleUrls: ['./sandboxes.component.css']
})
export class SandboxesComponent {

  sandboxes?: ISandbox[];

  constructor(
    private modalService: NgbModal,
    private sandboxService: SandboxService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  openModal(): void {
    const ref = this.modalService.open(ModalSandboxComponent, {centered: true});
    ref.closed.subscribe(sandbox => {
      this.sandboxService.create(sandbox).subscribe(() => this.load());
    })
  }

  cleanBox(sandbox: ISandbox): void {
    sandbox.limpoEm = new Date();
    this.sandboxService.patch(sandbox).subscribe(() => {
      sandbox.limpoEm = new Date();
    });
  }

  deleteBox(sandbox: ISandbox): void {
    const ref = this.modalService.open(ConfirmationModalComponent, {centered: true});
    ref.componentInstance.text = "Você tem certeza que deseja excluir essa caixa de areia?";
    ref.closed.subscribe(() => {
      if(!sandbox.id) {
        throw new Error("Sandbox missing id");
      }
      this.sandboxService.delete(sandbox.id).subscribe(() => this.load());
    })
  }

  load(): void {
    this.sandboxService.fetch().subscribe(_sandboxes => {
      this.sandboxes = _sandboxes as ISandbox[];
    });
  }
}
