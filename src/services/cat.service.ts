import { Injectable } from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import { Observable } from "rxjs";
import { ICat } from "src/model/Cat.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CatService {
    private base = environment.apiUrl + '/gato';
    
    constructor(
        private http: HttpClient,
    ) {}

    get(params?: any): Observable<HttpResponse<Object>> {
        return this.http.get(this.base, {
            observe: 'response',
            params
        });
    }

    post(body: any, params?: any): Observable<HttpResponse<Object>> {
        return this.http.post(this.base, body, {
            observe: 'response',
            params,
        });
    }

    put(cat: ICat): Observable<Object> {
        return this.http.put(`${this.base}/${cat.id}`, cat);
    }

    delete(cat: ICat): Observable<Object> {
        return this.http.delete(`${this.base}/${cat.id}`);
    }
}