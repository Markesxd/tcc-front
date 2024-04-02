import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { IHealthEvent } from "src/model/healthEvent.model";

@Injectable({
    providedIn: 'root'
})
export class HealthEventService {
    private baseUrl = environment.apiUrl + '/evento';
    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {}

    post(healthEvent: IHealthEvent): Observable<IHealthEvent> {
        return this.http.post(this.baseUrl, healthEvent, {
            headers: this.getHeaders(),
            observe: 'response'
        })
        .pipe(map(res => res.body as IHealthEvent));
    }

    fetch(): Observable<Object> {
        return this.http.get(this.baseUrl, {headers: this.getHeaders()});
    }

    put(healthEvent: IHealthEvent): Observable<Object> {
        return this.http.put(this.baseUrl, healthEvent, {
            headers: this.getHeaders(),
            observe: 'response'
        });
    }

    delete(id: number): Observable<Object> {
        return this.http.delete(`${this.baseUrl}/${id}`, {
            headers: this.getHeaders(),
            observe: 'response'
        });
    }

    private getHeaders(): HttpHeaders {
        const headers = new HttpHeaders();
        return headers.set("Authorization", "Bearer " + this.cookieService.get('token'));
    }
}