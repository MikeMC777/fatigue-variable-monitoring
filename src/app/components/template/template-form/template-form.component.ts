import { CrudVariableService } from 'src/app/services/crud-variable.service';
import { CrudDeviceService } from 'src/app/services/crud-device.service';
import { CrudTemplateService } from 'src/app/services/crud-template.service';
import { DeviceI } from 'src/app/models/device';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TemplateI } from 'src/app/models/template';
import { AuthService } from 'src/app/services/auth.service';
import { IdSenderService } from 'src/app/services/id-sender.service';
import { VariableI } from 'src/app/models/variable';
import { HttpParams } from '@angular/common/http';
import { NgbToast, NgbToastService, NgbToastType } from 'ngb-toast';
import { CommonConstants } from 'src/app/constants/common-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'fvm-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {

  templateFormGroup = new FormGroup({
    device_id: new FormControl('', [Validators.required]),
    variable_id: new FormControl('', [Validators.required]),
    position: new FormControl(null, Validators.required)
  },{validators: this.hasTemplateWithSamePosition()});
  templateItem!: TemplateI;
  deviceOptions: DeviceI[] = [];
  variableOptions: VariableI[] = [];
  templateByDevice: TemplateI[] = [];
  loaded = false;
  router: Router;
  typing = false;

  constructor(_router: Router, private _idSender: IdSenderService, private _authService: AuthService,
    private _templateService: CrudTemplateService, private _toastService: NgbToastService,
    private _deviceService: CrudDeviceService, private _variableService: CrudVariableService) {
    this.router = _router;
  }

  ngOnInit(): void {
    /*Si es formulario de editar*/
    if (this.router.url === '/edit-template') {
      this.loadInfoInsideForm(this._idSender._uuid).then(()=> {
        this.loadTemplatesByDevice(this.deviceId.value);
      });
    }
    this.loadDeviceOptions();
    this.loadVariableOptions();
  }

  get deviceId(): any {
    return this.templateFormGroup.get('device_id');
  }

  get variableId(): any {
    return this.templateFormGroup.get('variable_id');
  }

  get position(): any {
    return this.templateFormGroup.get('position');
  }

  async loadInfoInsideForm(_uuid: string): Promise<any> {
    //Si no tiene un id, debe devolverse a la dataTable de plantillas
    if (_uuid) {
      const params = new HttpParams()
        .append('id', _uuid);
      return this._templateService.loadTemplate(params).toPromise().then(data => {
        if (data.success) {
          this.templateItem = data.result;
          this.deviceId.setValue(this.templateItem.device_id);
          this.variableId.setValue(this.templateItem.variable_id);
          this.position.setValue(this.templateItem.position);
          return ;
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
      this.router.navigate(['/templates']);
    }
  }

  loadDeviceOptions(): any {
    this._deviceService.loadDevices().toPromise().then(data => {
      if (data.success) {
        this.deviceOptions = data.result;
      } else {
        const toast: NgbToast = {
          toastType:  NgbToastType.Danger,
          text: CommonConstants.OBJECT_QUERY_ERROR_MESSAGE,
          dismissible:  true,
          timeInSeconds: 5
        }
        this._toastService.show(toast);
      }
    }, error => {
      this._authService.getErrorToken(error);
    }).catch(err => {

    })
  }

  loadVariableOptions(): any {
    this._variableService.loadVariables().toPromise().then(data => {
      if (data.success) {
        this.variableOptions = data.result;
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
    }, error => {
      this._authService.getErrorToken(error);
    }).catch(err => {

    })
  }

  loadTemplatesByDevice(deviceId: string) {
    const params = new HttpParams()
        .append('id', deviceId);
    this._templateService.loadTemplatesByDevice(params).toPromise().then(data => {
      if (data.success) {
        this.templateByDevice = data.result;
      } else {
        const toast: NgbToast = {
          toastType:  NgbToastType.Danger,
          text: CommonConstants.OBJECT_QUERY_ERROR_MESSAGE,
          dismissible:  true,
          timeInSeconds: 5
        }
        this._toastService.show(toast);
      }
    }, error => {
      this._authService.getErrorToken(error);
    }).catch(err => {

    })
  }

  onChangeDeviceSelect(): void {
    this.position.setValue('');
    this.loadTemplatesByDevice(this.deviceId.value);
  }

  onChangeVariableSelect(): void {

  }

  /*Método que reinicia las variables de eventos del usuario cuando está digitando el nombre*/
  onTyping(event: any): void {
    if (event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 18 ) {
      this.typing = true;
    }
  }

  onCreate() {
    this.loaded = false;
    //Crear variable
    this._templateService.createTemplate(this.templateFormGroup.value).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.TEMPLATE_MESSAGE} ${CommonConstants.SUCCESSFUL_CREATE_PROCESS_TEXT}`
        });
        this.router.navigate(['/templates']);
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
    //Crear variable
    this.templateFormGroup.value.id = this.templateItem.id;
    this.templateFormGroup.value._uuid = this.templateItem._uuid;
    this._templateService.updateTemplate(this.templateFormGroup.value).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.TEMPLATE_MESSAGE} ${CommonConstants.SUCCESSFUL_UPDATE_PROCESS_TEXT}`
        });
        this.router.navigate(['/templates']);
      } else {
        //Error de proceso
        this._authService.getErrorProccess(data);
      }
    }, error => {
      this._authService.getErrorToken(error);
    }).catch(err => {

    })
  }

  hasTemplateWithSamePosition(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let isInvalid: boolean = false;
      if (!!this.templateByDevice) {
        for (let template of this.templateByDevice) {
          if ((template.position == control.value['position'] && !!this.templateItem && template._uuid !== this.templateItem._uuid)
              || template.position == control.value['position'] && !this.templateItem) {
            isInvalid = true;
            break;
          }
        }
      }
      return isInvalid ? {validTemplate: false} : null;
    };
  };

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
        this.router.navigate(['/templates']);
      }
    });
  }
}
