import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISandbox } from 'src/model/sandbox.model';

@Component({
  selector: 'app-modal-sandbox',
  standalone: true,
  imports: [CommonModule, NgbModule, ReactiveFormsModule],
  templateUrl: './modal-sandbox.component.html',
  styleUrls: ['./modal-sandbox.component.css']
})
export class ModalSandboxComponent {

  form = this.fb.group({
    name: ['', [Validators.required]]
  })

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  save(): void {
    this.activeModal.close(this.createFromForm());
  }

  createFromForm(): ISandbox {
    const sandbox = {} as ISandbox;
    sandbox.nome = this.form.get('name')?.value ?? '';
    sandbox.limpoEm = new Date();
    return sandbox;
  }
}
