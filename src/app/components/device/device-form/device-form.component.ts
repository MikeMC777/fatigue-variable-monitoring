import { AuthService } from './../../../services/auth.service';
import { IdSenderService } from 'src/app/services/id-sender.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DeviceI } from 'src/app/models/device';
import { CrudDeviceService } from 'src/app/services/crud-device.service';
import { HttpParams } from '@angular/common/http';
import { NgbToast, NgbToastType, NgbToastService } from 'ngb-toast';
import Swal from 'sweetalert2';
import { CommonConstants } from './../../../constants/common-constants';

@Component({
  selector: 'fvm-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent implements OnInit {
  maxDate: Date = new Date();
  deviceFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    reference: new FormControl(null, Validators.required),
    description: new FormControl('', Validators.maxLength(250)),
    status: new FormControl(true, null)
  });
  /* Elemento de dispositivo por defecto */
  deviceItem!: DeviceI;
  /*Validaciones del formulario */
  validReference = true;
  typing = false;
  loaded = false;
  codes: string[] = [];
  router: Router

  constructor(_router: Router, private _idSender: IdSenderService, private _authService: AuthService,
    private _deviceService: CrudDeviceService, private _toastService: NgbToastService) {
    this.router = _router;
  }

  ngOnInit(): void {
    /*Si es formulario de editar*/
    if (this.router.url === '/edit-device') {
      this.loadInfoInsideForm(this._idSender._uuid);
    }
    /*Si es formulario de crear*/
    else {
      this.loaded = true;
    }
  }

  get name(): any {
    return this.deviceFormGroup.get('name');
  }
  get reference(): any {
    return this.deviceFormGroup.get('reference');
  }
  get description(): any {
    return this.deviceFormGroup.get('description');
  }
  get status(): any {
    return this.deviceFormGroup.get('status');
  }

  loadInfoInsideForm(_uuid: string): any {
    //Si no tiene un id, debe devolverse a la dataTable de dispositivos
    if (_uuid) {
      const params = new HttpParams()
        .append('id', _uuid);
      this._deviceService.loadDevice(params)
      .subscribe(data => {
        if (data.success) {
          this.deviceItem = data.result;
          this.name.setValue(this.deviceItem.name);
          this.reference.setValue(this.deviceItem.reference);
          this.description.setValue(this.deviceItem.description);
          this.status.setValue(this.deviceItem.status);
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
      this.router.navigate(['/devices']);
    }
  }

  validateReference(): boolean {
    if (this.reference !== '') {
      this.typing = false;
      return this.getReferencesOfDevices();
    }
    return false;
  }
  getReferencesOfDevices(): boolean {
    this._deviceService.loadDevices().toPromise().then(data => {
      if (data.success) {
        const deviceList: DeviceI[] = data.result;
        for (let device of deviceList) {
          if (this.reference.value == device.reference) {
            this.validReference = false;
            const toast: NgbToast = {
              toastType:  NgbToastType.Danger,
              text: `${CommonConstants.DEVICE_ALREADY_EXISTS_ERROR_MESSAGE} ${this.reference.value}`,
              dismissible:  true,
              timeInSeconds: 5
            }
            this._toastService.show(toast);
            return false;
          }
        }
        this.validReference = true;
        return true;
      } else {
        this._authService.getErrorTable();
      }
      this.validReference = false;
    }, error => {
      this._authService.getErrorToken(error);
    })
    .catch(err => {
        return false;
      });
    return false;
  }
  /*Método que reinicia las variables de eventos del usuario cuando está digitando el código*/
  onTyping(event: any): void {
    if (event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 18 ) {
      this.typing = true;
    }
  }

  onCreate() {
    this.loaded = false;
    //Crear dispositivo
    this._deviceService.createDevice(this.deviceFormGroup.value).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.DEVICE_MESSAGE} ${this.deviceFormGroup.value.name} ${CommonConstants.SUCCESSFUL_CREATE_PROCESS_TEXT}`
        });
        this.router.navigate(['/devices']);
      } else {
        //Error de proceso
        this._authService.getErrorProccess(data);
      }
    }, error => {
      this._authService.getErrorToken(error);
    }).catch(err => {

    })
  }
  onUpdate() {
    this.loaded = false;
    //Crear dispositivo
    this.deviceFormGroup.value.id = this.deviceItem.id;
    this.deviceFormGroup.value._uuid = this.deviceItem._uuid;
    this._deviceService.updateDevice(this.deviceFormGroup.value).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.DEVICE_MESSAGE} ${this.deviceItem.name} ${CommonConstants.SUCCESSFUL_UPDATE_PROCESS_TEXT}`
        });
        this.router.navigate(['/devices']);
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
        this.router.navigate(['/devices']);
      }
    });
  }

}

