import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserI } from 'src/app/models/user';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
/*Funcionalidad javascript para manejar eventos botón de mostrar/ocultar contraseña.*/
declare function showHidePassword(element: string): any;
@Component({
  selector: 'fvm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginComponent implements OnInit {

  passElementId = '#show_hide_password';
  uuidValue: string = '';
  date: Date = new Date();
  currentYear: number = this.date.getFullYear();
  private user: UserI = {
    name: '',
    surname: '',
    nickname: '',
    email: '',
    password: ''
  };
  signUpForm!: UntypedFormGroup;

  constructor(private _authService: AuthService, private router: Router, private builder: UntypedFormBuilder) {}

  ngOnInit() {
    this.signUpForm = this.builder.group({
      nickname : ['', Validators.required],
      password : ['', Validators.required]
    });
    showHidePassword(this.passElementId);
  }

  showWelcomeMessage(data: any) {
    Swal.fire({
      title: 'Autenticando...',
      onBeforeOpen: () => {
        Swal.showLoading();
        return this.onLogin(data);
      }
    });
  }

  onLogin(infoUser: any) {
    this.user.nickname = infoUser.nickname;
    this.user.password = infoUser.password;
    console.log('this.user55', this.user);
    const filterUser = CryptoJS.AES.encrypt(JSON.stringify(this.user), `${environment.secretkey}`).toString();
    return this._authService.loginUser(filterUser)
    .subscribe(data => {
      if (data.success) {
        this._authService.setUser(data.result);
        this._authService.setToken(data.token);
        Swal.fire({
          type: 'success',
          title: `Bienvenido(a), ${data.result.name}` ,
          confirmButtonText: 'Aceptar',
          onClose: () => {
            location.href = '';
          }
        });
      } else {
        Swal.fire({
          type: 'error',
          title: 'Usuario y/o contraseña incorrectos',
          confirmButtonText: 'Intenta nuevamente'
        });
      }
    },
    error =>
      Swal.fire({
        type: 'error',
        title: 'Error de conexión'
      })
    )
  }
}

