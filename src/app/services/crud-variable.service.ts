import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { VariableI } from '../models/variable';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CrudVariableService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': this.authService.getToken() || ''
  });

  loadVariables(): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/variable/get`;
    return this.httpClient
    .get(urlApi, {headers: this.headers})
    .pipe(map(data => data));
  }

  loadVariable(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/variable/get/${params.get('id')}`;
    return this.httpClient
    .get(urlApi, {params, headers: this.headers})
    .pipe(map(data => data));
  }

  createVariable(newVariable: VariableI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/variable/post`;
    return this.httpClient
    .post(urlApi, newVariable, {headers: this.headers})
    .pipe(map(data => data));
  }

  updateVariable(selectedVariable: VariableI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/variable/put/${selectedVariable._uuid}`;
    return this.httpClient
    .put(urlApi, selectedVariable, {headers: this.headers})
    .pipe(map(data => data));
  }

  deleteVariable(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/variable/delete/${params.get('id')}`;
    return this.httpClient
    .delete(urlApi, {headers: this.headers, params})
    .pipe(map(data => data));
  }

}
