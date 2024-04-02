import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ISandbox } from "src/model/sandbox.model";

@Injectable({providedIn:'root'})
export class SandboxService {
    private readonly baseUrl = environment.apiUrl + '/caixa-de-areia';

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {}

    create(sandbox: ISandbox): Observable<Object> {
        return this.http.post(this.baseUrl, sandbox, {
            headers: this.getHeaders(),
        });
    }

    delete(id: number): Observable<Object> {
        return this.http.delete(`${this.baseUrl}/${id}`, {headers: this.getHeaders()});
    }

    patch(sandbox: ISandbox): Observable<Object> {
        return this.http.put(`${this.baseUrl}/${sandbox.id}`, sandbox, {headers: this.getHeaders()});
    }

    fetch(): Observable<Object> {
        return this.http.get(this.baseUrl, {headers: this.getHeaders()});
    }

    private getHeaders(): HttpHeaders {
        const headers = new HttpHeaders();
        return headers.set("Authorization", "Bearer " + this.cookieService.get('token'));
    }
}