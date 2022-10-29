import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { EmployeeI } from '../models/employee';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CrudFileReadingService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': this.authService.getToken() || ''
  });

  loadFileReading(): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/plot-sent/get`;
    return this.httpClient
    .get(urlApi, {headers: this.headers})
    .pipe(map(data => data));
  }
}
