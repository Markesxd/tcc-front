import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/services/user.service';
import { IUser, User } from 'src/model/User.model';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
  standalone: true
})
export class UserPageComponent implements OnInit{

  user: IUser = new User;

  constructor (
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.fetch().subscribe(user => {
      this.user = user;
    });
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => this.router.navigate(['/']) 
    );
  }
}
