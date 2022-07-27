import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import  { NgbToast, NgbToastService, NgbToastType }  from  'ngb-toast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router, private  toastService:  NgbToastService) {}

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });


  loginUser(login: string): Observable<any> {
    const urlApi = `${environment.apiUrl}/api/post/validar-usuario`;
    return this.httpClient
    .post(urlApi, {login}, {headers: this.headers})
    .pipe(map(data => data));
  }

  setUser(user: string): void {
    const userString = JSON.stringify(user);
    localStorage.setItem('currentUser', userString);
  }

  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  setLang(lang: string): void {
    localStorage.setItem('lang', lang);
  }

  getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    if (!!userString) {
      const user = JSON.parse(userString);
      return user;
    }
    return null;
  }

  logOutUser() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
  //Obtener error en Token
  getErrorToken(error: any) {
    console.error('Error', error);
    if (error.error.message === 'TokenExpiredError') {
      const toast: NgbToast = {
        toastType:  NgbToastType.Danger,
        text:  "Token ha expirado. Inicie sesión nuevamente.",
        dismissible:  true,
      }
      this.toastService.show(toast);
      this.logOutUser();
    } else {
      Swal.fire({
        type: 'error',
        title: 'Problemas con la conexión'
      });
    }
  }
  //Obtener error del acceso a tabla
  getErrorTable() {
    Swal.fire({
      type: 'error',
      title: 'Imposible el acceso',
      text: 'Error intentando acceder a la base de datos'
    });
  }
  //Obtener error procceso fallido
  getErrorProccess(data: any){
    console.log('Error proceso ', data);
     Swal.fire({
      type: 'error',
      title: 'Proceso fallido',
      text: data.result
     });
  }
  //Se encripta los parametros
  encryptParams(data: any): string {
   // Proceso para encriptar la información obtenida
   return CryptoJS.AES.encrypt(JSON.stringify(data), `${environment.secretkey}`).toString();
 }
  //Desencriptar valores
 decryptParams(data: any): any[] | any{
   if(data){
     const result = String(data).replace(/ /g, '+');
     const bytes = CryptoJS.AES.decrypt(result, `${environment.secretkey}`);
     //Si viene con valores de encriptación
     if (bytes.sigBytes > 0){
       //console.log('Objeto ', JSON.parse(bytes.toString(CryptoJS.enc.Utf8)));
       //Almacaneamos la información del mensajero
       //console.log('Desencriptar ', JSON.parse(bytes.toString(CryptoJS.enc.Utf8)));
       return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
     }
     return undefined;
   }else{
     return [];
   }
 }

  decryptParam(data: any): string | undefined{
   if(data){
     const result = String(data).replace(/ /g, '+');
     const bytes = CryptoJS.AES.decrypt(result, `${environment.secretkey}`);
     //Si viene con valores de encriptación
     if (bytes.sigBytes > 0){
       return bytes.toString(CryptoJS.enc.Utf8);
     }
   }
   return undefined;
 }

}

