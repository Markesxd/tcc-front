import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { IHealthEvent } from "src/model/healthEvent.model";

@Injectable({
    providedIn: 'root'
})
export class HealthEventService {
    private baseUrl = environment.apiUrl + '/evento';
    constructor(
        private http: HttpClient
    ) {}

    post(healthEvent: IHealthEvent): Observable<IHealthEvent> {
        return this.http.post(this.baseUrl, healthEvent, {
            observe: 'response'
        })
        .pipe(map(res => res.body as IHealthEvent));
    }

    fetch(): Observable<Object> {
        return this.http.get(this.baseUrl);
    }

    put(healthEvent: IHealthEvent): Observable<Object> {
        return this.http.put(this.baseUrl, healthEvent, {
            observe: 'response'
        });
    }

    delete(id: number): Observable<Object> {
        return this.http.delete(`${this.baseUrl}/${id}`, {
            observe: 'response'
        });
    }
}