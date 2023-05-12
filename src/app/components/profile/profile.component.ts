import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbToast, NgbToastService, NgbToastType } from 'ngb-toast';
import { CommonConstants } from 'src/app/constants/common-constants';
import { UserI } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CrudUserService } from 'src/app/services/crud-user.service';
import { IdSenderService } from 'src/app/services/id-sender.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'fvm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required, Validators.maxLength(30)]),
    surname: new UntypedFormControl('', [Validators.required, Validators.maxLength(30)]),
    nickname: new UntypedFormControl('', Validators.maxLength(10)),
    password: new UntypedFormControl('', Validators.maxLength(20)),
    email: new UntypedFormControl('@', [Validators.required, Validators.email, Validators.maxLength(100)])
  });
  /* Elemento de empleado por defecto */
  userItem!: UserI;
  /*Validaciones del formulario */
  validNickName = true;
  validEmail = true;
  typing = false;
  loaded = false;
  router: Router;

  constructor(_router: Router, private _idSender: IdSenderService, private _authService: AuthService,
    private _userService: CrudUserService, private _toastService: NgbToastService) {
      this.router = _router;
    }

  ngOnInit(): void {
    this.loadInfoInsideForm(this._authService.getCurrentUser()._uuid);
  }

  get name(): any {
    return this.userFormGroup.get('name');
  }
  get surname(): any {
    return this.userFormGroup.get('surname');
  }
  get nickname(): any {
    return this.userFormGroup.get('nickname');
  }

  get password(): any {
    return this.userFormGroup.get('password');
  }
  get email(): any {
    return this.userFormGroup.get('email');
  }

  loadInfoInsideForm(_uuid: string): any {
    //Si no tiene un id, debe devolverse a la dataTable de empleados
    if (_uuid) {
      const params = new HttpParams()
        .append('id', _uuid);
      this._userService.loadUser(params)
      .subscribe(data => {
        if (data.success) {
          this.userItem = data.result;
          this.name.setValue(this.userItem.name);
          this.surname.setValue(this.userItem.surname);
          this.password.setValue(this.userItem.password);
          this.nickname.setValue(this.userItem.nickname);
          this.email.setValue(this.userItem.email);
          this.loaded = true;
        } else {
          const toast: NgbToast = {
            toastType:  NgbToastType.Danger,
            text: CommonConstants.OBJECT_QUERY_ERROR_MESSAGE,
            dismissible:  true,
            timeInSeconds: 5
          }
          this._toastService.show(toast);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  /*Método que reinicia las variables de eventos del usuario cuando está digitando el código*/
  onTyping(event: any): void {
    if (event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 18 ) {
      this.typing = true;
    }
  }

  onUpdate() {
    this.loaded = false;
    //Modificar usuario
    this.userFormGroup.value._uuid = this.userItem._uuid;

    this._userService.updateUser(this.userFormGroup.value).toPromise().then((data: any) => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.USER_MESSAGE} ${this.userFormGroup.value.name} ${this.userFormGroup.value.surname} ${CommonConstants.SUCCESSFUL_UPDATE_PROCESS_TEXT}`
        });
        this.router.navigate(['/']);
      } else {
        //Error de proceso
        this._authService.getErrorProccess(data);
      }
    }, error => {
      this._authService.getErrorToken(error);
    }).catch(err => {

    })
  }
  onCancel() {
    Swal.fire({
      title: CommonConstants.CANCEL_PROCESS_TITLE,
      text: CommonConstants.CANCEL_PROCESS_TEXT,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: CommonConstants.YES_TEXT,
      cancelButtonColor: '#d33',
      cancelButtonText: CommonConstants.NO_TEXT
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/']);
      }
    });
  }

}
