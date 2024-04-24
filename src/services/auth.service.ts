import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from 'src/model/User.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {}

  login(user: IUser): Observable<HttpResponse<Object>> {
    return this.http.post(environment.apiUrl + '/login', user, {
        observe: 'response'
    })
    .pipe(tap(
      (res: HttpResponse<any>) => {
        localStorage.setItem('token', res.body?.token)
        localStorage.setItem('refresh', res.body?.refresh_token)
      }
    ));
  }

  logout(): Observable<void> {
    //todo: implement a logout route
    return of(localStorage.removeItem('token'));
  }

  singUp(user: IUser): Observable<Object> {
    return this.http.post(environment.apiUrl + '/register', user);
  }

  refresh(): Observable<HttpResponse<Object>> {
      const token = localStorage.getItem('refresh');
      if(!token) {
        throw new Error('No refresh token');
      }
      const body = new HttpParams()
        .set('refresh_token', token);
      return this.http.post(environment.apiUrl + '/refresh', body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        observe: 'response'
    })
    .pipe(tap(
      (res: HttpResponse<any>) => {
        localStorage.setItem('token', res.body?.token);
        localStorage.setItem('refresh', res.body?.refresh_token);
      }
    ));
  }
}
