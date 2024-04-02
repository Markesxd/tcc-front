import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IMeal, IPlan } from "src/model/Plan.model";

@Injectable({
    providedIn: 'root'
})
export class PlanService {
    private baseUrl = environment.apiUrl + '/plano-alimentar';
    
    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {}

    post(plan: IPlan): Observable<HttpResponse<Object>> {
        return this.http.post(this.baseUrl, plan, {
            headers: this.getHeaders(), 
            observe: 'response'
        });
    }

    fetch(): Observable<Object> {
        return this.http.get(this.baseUrl, {headers: this.getHeaders()});
    }

    put(plan: IPlan): Observable<Object> {
        return this.http.put(this.baseUrl, plan, {headers: this.getHeaders()});
    }

    delete(plan: IPlan): Observable<Object> {
        return this.http.delete(`${this.baseUrl}/${plan.id}`, {headers: this.getHeaders()});
    }

    serve(meal: IMeal): Observable<Object> {
        return this.http.put(`${this.baseUrl}/servir`, meal, {headers: this.getHeaders()});
    }

    private getHeaders(): HttpHeaders {
        const headers = new HttpHeaders();
        return headers.set("Authorization", "Bearer " + this.cookieService.get('token'));
    }
}