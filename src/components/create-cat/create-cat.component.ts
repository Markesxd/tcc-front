import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICat } from 'src/model/Cat.model';

@Component({
  selector: 'app-create-cat',
  templateUrl: './create-cat.component.html',
  styleUrls: ['./create-cat.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class CreateCatComponent {
  
  editForm = this.fb.group({
    name: ['', [Validators.required]],
    birthday: '',
    gender: 0
  })

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
  ) {}

    onSubmit(): void {
      this.activeModal.close(this.createFromForm());
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
}
