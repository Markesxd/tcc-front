import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICat, TypeSex } from 'src/model/Cat.model';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-create-cat',
  templateUrl: './create-cat.component.html',
  styleUrls: ['./create-cat.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateCatComponent {
  isNew = true;

  @Output()
  delete = new EventEmitter<void>();

  editForm = this.fb.group({
    name: ['', [Validators.required]],
    birthday: '',
    gender: 0
  })

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

    onSubmit(): void {
      this.activeModal.close(this.createFromForm());
    }

    onDelete(): void {
      const ref = this.modalService.open(ConfirmationModalComponent, {centered: true});
      ref.componentInstance.text = "Você tem certeza que deseja excluir este gato?"
      ref.closed.subscribe(() => {
        this.delete.emit();
      });
      this.activeModal.dismiss();
    }

    createFromForm(): ICat {
      const cat = {} as ICat;
      cat.nome = this.editForm.get('name')?.value ?? '';
      cat.aniversario = new Date(this.editForm.get('birthday')?.value ?? '');
      cat.sexo = Number(this.editForm.get('gender')?.value ?? 0);
      return cat;
    }

    dismiss(): void {
      this.activeModal.dismiss();
    }

    loadDate(date: string): void {
      const input = <HTMLInputElement | null> document.querySelector("#birthday");
        setTimeout(() => {
          if(input)
            input.value = date.split('T')[0];
        }, 200);
    }

    loadGender(gender: TypeSex) {
      const _gender = gender === TypeSex.MALE ? 'M' : 'F';
      const input = <HTMLInputElement> document.querySelector(`#gender${_gender}`);
      setTimeout(() => {
          input.checked = true;
      }, 200);
    }
}
