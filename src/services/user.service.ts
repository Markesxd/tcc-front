import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { IAuthenticationResponse } from "src/model/AuthenticationResponse.model";
import { ICat } from "src/model/Cat.model";
import { IUser } from "src/model/User.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = environment.apiUrl + '/user';

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {}

    fetch(): Observable<IUser> {
        return this.http.get(`${this.baseUrl}`, {
            observe: 'response'
        }).pipe(map((res: HttpResponse<IUser>) => {
            return res.body ?? {};
        }));
    }
}