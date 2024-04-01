import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { User } from 'src/model/User.model';

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
  })

  constructor (
    protected fb: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  onSubmit() {
    const user = new User();
    user.createFromForm(this.editForm);
    this.userService.singUp(user)
    .subscribe(() => {
      user.username = user.email;
      this.userService.login(user).subscribe(authResponse => {
        this.cookieService.set('token', authResponse.token, 1);
        this.router.navigate(['my-page']);
      });
    });
  }
}
