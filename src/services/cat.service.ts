import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import { Observable } from "rxjs";
import { ICat } from "src/model/Cat.model";
import { CookieService } from "ngx-cookie-service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CatService {
    private base = environment.apiUrl + '/gato';
    
    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {}

    get(params?: any): Observable<HttpResponse<Object>> {
        return this.http.get(this.base, {
            headers: this.getHeaders(),
            observe: 'response',
            params
        });
    }

    post(body: any, params?: any): Observable<HttpResponse<Object>> {
        return this.http.post(this.base, body, {
            headers: this.getHeaders(),
            observe: 'response',
            params,
        });
    }

    put(cat: ICat): Observable<Object> {
        return this.http.put(this.base, cat, {headers: this.getHeaders()});
    }

    delete(cat: ICat): Observable<Object> {
        return this.http.delete(`${this.base}/${cat.id}`, {headers: this.getHeaders()});
    }

    private getHeaders(): HttpHeaders {
        const headers = new HttpHeaders();
        return headers.set("Authorization", "Bearer " + this.cookieService.get('token'));
    }
}