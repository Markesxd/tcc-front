import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs';
import { User } from 'src/model/User.model';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class LoginComponent {

  loginFailed = false;
  serviceFailed = false;

  editForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  constructor (
    protected fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  get emailErrors(): ValidationErrors | null | undefined {
    const email = this.editForm.get('email'); 
    return email?.touched ? email.errors : null;
  }

  get isPasswordValid(): boolean {
    const password = this.editForm.get('password');
    if(!password) {
      return false;
    }
    return !password.dirty || password.errors === null;
  }

  onSubmit() {
    const user = new User();
    user.createFromForm(this.editForm);
    user.username = user.email;
    this.authService.login(user)
      .pipe(catchError((err) => {
        if(err.status === 401) {
          this.loginFailed = true;
        } else {
          this.serviceFailed = true;
        }
        throw err;
      }))
      .subscribe(() => {
        this.router.navigate(['food']); 
      });
  }
}
