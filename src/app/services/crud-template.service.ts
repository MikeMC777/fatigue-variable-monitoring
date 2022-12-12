import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { TemplateI } from '../models/template';

@Injectable({
  providedIn: 'root'
})
export class CrudTemplateService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': this.authService.getToken() || ''
  });

  loadTemplates(): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/template/get`;
    return this.httpClient
    .get(urlApi, {headers: this.headers})
    .pipe(map(data => data));
  }

  loadTemplate(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/template/get/${params.get('id')}`;
    return this.httpClient
    .get(urlApi, {params, headers: this.headers})
    .pipe(map(data => data));
  }

  loadTemplatesByDevice(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/template/device/get/${params.get('id')}`;
    return this.httpClient
    .get(urlApi, {params, headers: this.headers})
    .pipe(map(data => data));
  }

  createTemplate(newTemplate: TemplateI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/template/post`;
    return this.httpClient
    .post(urlApi, newTemplate, {headers: this.headers})
    .pipe(map(data => data));
  }

  updateTemplate(selectedTemplate: TemplateI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/template/put/${selectedTemplate._uuid}`;
    return this.httpClient
    .put(urlApi, selectedTemplate, {headers: this.headers})
    .pipe(map(data => data));
  }

  deleteTemplate(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/template/delete/${params.get('id')}`;
    return this.httpClient
    .delete(urlApi, {headers: this.headers, params})
    .pipe(map(data => data));
  }
}
