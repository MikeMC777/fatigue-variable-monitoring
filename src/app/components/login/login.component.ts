import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserI } from 'src/app/models/user';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    nombre: '',
    password: ''
  };
  signUpForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private builder: FormBuilder) {}

  ngOnInit() {
    this.signUpForm = this.builder.group({
      name : ['', Validators.required],
      password : ['', Validators.required]
    });
    showHidePassword(this.passElementId);
  }

  showWelcomeMessage(data: any) {
    Swal.fire({
      title: 'Confirmado',
      onBeforeOpen: () => {
        Swal.showLoading();
        return this.onLogin(data);
      }
    });
  }

  onLogin(infoUser: any) {
    this.user.nombre = infoUser.name;
    this.user.password = infoUser.password;
    const filterUser = CryptoJS.AES.encrypt(JSON.stringify(this.user), `${environment.secretkey}`).toString();
    return this.authService.loginUser(filterUser)
    .subscribe(data => {
      if (data.success) {
        this.authService.setUser(data.result[0]);
        this.authService.setToken(data.token);
        Swal.fire({
          type: 'success',
          title: `Bienvenido, ${data.result[0].NOMBRE}` ,
          confirmButtonText: 'Ingresar a la plataforma',
          onClose: () => {
            location.href = '';
          }
        });
      } else {
        Swal.fire({
          type: 'error',
          title: 'Usuario y/o contraseña equivocados',
          confirmButtonText: 'Intenta nuevamente'
        });
      }
    },
    error => Swal.fire({
      type: 'error',
      title: 'Error de conexión'
    }));
  }
}

