import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { Observable, catchError, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isBeingRefreshed = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this.isBeingRefreshed) {
      return next.handle(request);
    }
    const token = localStorage.getItem('token');
    if(token === null || token === '') {
      this.router.navigate(['/']);
      return next.handle(request);
    }
    const req = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
    return next.handle(req)
      .pipe(catchError(this.handleError)
      );
  }

  private handleError = (err: HttpErrorResponse) => {
    if(err.status === 401 && !this.isBeingRefreshed) {
      this.isBeingRefreshed = true;
      this.authService.refresh()
      .pipe(
        finalize(() => {
          this.isBeingRefreshed = false
        })
      ).subscribe();
    } 
    throw err
  }
}
