import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { IAuthenticationResponse } from "src/model/AuthenticationResponse.model";
import { ICat } from "src/model/Cat.model";
import { IPlan } from "src/model/Plan.model";
import { IUser } from "src/model/User.model";
import { IHealthEvent } from "src/model/healthEvent.model";
import { ISandbox } from "src/model/sandbox.model";

interface ICatsResponse {
    cats?: ICat[]
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = environment.apiUrl + '/user';

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {}

    login(user: IUser): Observable<IAuthenticationResponse> {
        return this.http.post(environment.apiUrl + '/login', user, {
            observe: 'response'
        }).pipe(map(res => res.body as IAuthenticationResponse));
    }

    singUp(user: IUser): Observable<Object>
    {
        return this.http.post(environment.apiUrl + '/register', user);
    }

    fetch(): Observable<IUser> {
        return this.http.get(`${this.baseUrl}`, {
            headers: this.getHeaders(),
            observe: 'response'
        }).pipe(map((res: HttpResponse<IUser>) => {
            return res.body ?? {};
        }));
    }

    private getHeaders(): HttpHeaders {
        const headers = new HttpHeaders();
        return headers.set("Authorization", "Bearer " + this.cookieService.get('token'));
    }
}