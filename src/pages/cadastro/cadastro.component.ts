import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { User } from 'src/model/User.model';
import { matchingPasswordValidator } from 'src/validators/matchingPasswordValidator.directive';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class CadastroComponent {

  editForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    repeat: ['', [Validators.required]]
  },
  {
    validators: [matchingPasswordValidator]
  })

  constructor (
    protected fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  get nameControl(): AbstractControl | null {
    return this.editForm.get('name');
  }

  get emailControl(): AbstractControl | null {
    return this.editForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.editForm.get('password'); 
  }

  get repeatControl(): AbstractControl | null {
    return this.editForm.get('repeat'); 
  }

  onSubmit() {
    const user = new User();
    user.createFromForm(this.editForm);
    this.authService.singUp(user)
    .subscribe(() => {
      user.username = user.email;
      this.authService.login(user).subscribe(() => {
        this.router.navigate(['my-page']);
      });
    });
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
