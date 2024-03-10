import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Cat, ICat } from 'src/model/Cat.model';
import { User } from 'src/model/User.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class ModalComponent {
  @Input()
  show = true;

  @Output()
  onClose = new EventEmitter<ICat | undefined>();

  editForm = this.fb.group({
    name: ['', [Validators.required]],
    birthday: '',
    gender: ''
  })

  constructor(
    protected fb: FormBuilder,
    private cookieService: CookieService
  ) {}

  close(cat?: ICat): void {
    this.editForm.get('name')?.patchValue('');
    this.editForm.get('birthday')?.patchValue('');
    this.editForm.get('gender')?.patchValue('');
    this.onClose.emit(cat);
  }

  onSubmit():void {
    const cat = new Cat();
    const owner = new User;
    owner.id = this.cookieService.get('id');
    cat.createFromForm(this.editForm, owner);
    this.close(cat);
  }
}
