import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserI } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CrudUserService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': this.authService.getToken() || ''
  });

  loadUser(params: HttpParams): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/user/get/${params.get('id')}`;
    return this.httpClient
    .get(urlApi, {params, headers: this.headers})
    .pipe(map(data => data));
  }

  updateUser(user: UserI): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/user/put/${user._uuid}`;
    return this.httpClient
    .put(urlApi, user, {headers: this.headers})
    .pipe(map(data => data));
  }
}
