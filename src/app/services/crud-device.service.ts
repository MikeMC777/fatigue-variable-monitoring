import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { DeviceI } from '../models/device';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CrudDeviceService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': this.authService.getToken() || ''
  });

  loadDevices(): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/device/get`;
    return this.httpClient
    .get(urlApi, {headers: this.headers})
    .pipe(map(data => data));
  }

  loadDevice(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/device/get/${params.get('id')}`;
    return this.httpClient
    .get(urlApi, {params, headers: this.headers})
    .pipe(map(data => data));
  }

  createDevice(newDevice: DeviceI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/device/post`;
    return this.httpClient
    .post(urlApi, newDevice, {headers: this.headers})
    .pipe(map(data => data));
  }

  updateDevice(selectedDevice: DeviceI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/device/put/${selectedDevice._uuid}`;
    return this.httpClient
    .put(urlApi, selectedDevice, {headers: this.headers})
    .pipe(map(data => data));
  }

  deleteDevice(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/device/delete/${params.get('id')}`;
    return this.httpClient
    .delete(urlApi, {headers: this.headers, params})
    .pipe(map(data => data));
  }

}
