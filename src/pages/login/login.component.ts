import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { User } from 'src/model/User.model';

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
    private userService: UserService,
    private cookieService: CookieService,
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
    this.userService.login(user)
    .pipe(map(d => d),
    catchError((err: HttpErrorResponse) => {
      if(err.status === 401) {
        this.loginFailed = true;
      } else {
        this.serviceFailed = true;
      }
      throw err;
    }))
    .subscribe(response => {
      this.cookieService.set('token', response.token, 1);
      this.router.navigate(['my-page']);
    })
  }
}
