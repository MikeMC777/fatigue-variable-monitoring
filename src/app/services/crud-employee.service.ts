import { EmployeeDeviceI } from 'src/app/models/employee';
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
export class CrudEmployeeService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': this.authService.getToken() || ''
  });

  loadEmployees(): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/employee/get`;
    return this.httpClient
    .get(urlApi, {headers: this.headers})
    .pipe(map(data => data));
  }

  loadEmployee(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/employee/get/${params.get('id')}`;
    return this.httpClient
    .get(urlApi, {params, headers: this.headers})
    .pipe(map(data => data));
  }

  createEmployee(newEmployee: EmployeeI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/employee/post`;
    return this.httpClient
    .post(urlApi, newEmployee, {headers: this.headers})
    .pipe(map(data => data));
  }

  updateEmployee(selectedEmployee: EmployeeI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/employee/put/${selectedEmployee._uuid}`;
    return this.httpClient
    .put(urlApi, selectedEmployee, {headers: this.headers})
    .pipe(map(data => data));
  }

  deleteEmployee(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/employee/delete/${params.get('id')}`;
    return this.httpClient
    .delete(urlApi, {headers: this.headers, params})
    .pipe(map(data => data));
  }

  loadDevices(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/employee/device/get/${params.get('id')}`;
    return this.httpClient
    .get(urlApi, {params, headers: this.headers})
    .pipe(map(data => data));
  }

  createDevice(newDevice: EmployeeDeviceI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/employee/device/post`;
    return this.httpClient
    .post(urlApi, newDevice, {headers: this.headers})
    .pipe(map(data => data));
  }

  deleteDevice(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/employee/device/delete/${params.get('id')}`;
    return this.httpClient
    .delete(urlApi, {headers: this.headers, params})
    .pipe(map(data => data));
  }
}
