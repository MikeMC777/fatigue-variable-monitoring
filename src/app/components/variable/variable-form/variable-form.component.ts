import { AuthService } from './../../../services/auth.service';
import { IdSenderService } from 'src/app/services/id-sender.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableI } from 'src/app/models/variable';
import { CrudVariableService } from 'src/app/services/crud-variable.service';
import { HttpParams } from '@angular/common/http';
import { NgbToast, NgbToastType, NgbToastService } from 'ngb-toast';
import Swal from 'sweetalert2';
import { CommonConstants } from './../../../constants/common-constants';

@Component({
  selector: 'fvm-variable-form',
  templateUrl: './variable-form.component.html',
  styleUrls: ['./variable-form.component.scss']
})
export class VariableFormComponent implements OnInit {
  maxDate: Date = new Date();
  variableFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    data_type: new FormControl('DEC', Validators.maxLength(3)),
    measurement_unit: new FormControl('', Validators.maxLength(100)),
    min_range: new FormControl(null, Validators.required),
    max_range: new FormControl(null, Validators.required),
    status: new FormControl(true, null)
  });
  /* Elemento de variable por defecto */
  variableItem!: VariableI;
  /*Validaciones del formulario */
  validName = true;
  typing = false;
  loaded = false;
  router: Router;

  constructor(_router: Router, private _idSender: IdSenderService, private _authService: AuthService,
    private _variableService: CrudVariableService, private _toastService: NgbToastService) {
    this.router = _router;
  }

  ngOnInit(): void {
    /*Si es formulario de editar*/
    if (this.router.url === '/edit-variable') {
      this.loadInfoInsideForm(this._idSender._uuid);
    }
    /*Si es formulario de crear*/
    else {
      this.loaded = true;
    }
  }

  get name(): any {
    return this.variableFormGroup.get('name');
  }
  get dataType(): any {
    return this.variableFormGroup.get('data_type');
  }
  get measurementUnit(): any {
    return this.variableFormGroup.get('measurement_unit');
  }
  get minRange(): any {
    return this.variableFormGroup.get('min_range');
  }
  get maxRange(): any {
    return this.variableFormGroup.get('max_range');
  }
  get status(): any {
    return this.variableFormGroup.get('status');
  }

  loadInfoInsideForm(_uuid: string): any {
    //Si no tiene un id, debe devolverse a la dataTable de variables
    if (_uuid) {
      const params = new HttpParams()
        .append('id', _uuid);
      this._variableService.loadVariable(params)
      .subscribe(data => {
        if (data.success) {
          this.variableItem = data.result;
          this.name.setValue(this.variableItem.name);
          this.dataType.setValue(this.variableItem.data_type);
          this.measurementUnit.setValue(this.variableItem.measurement_unit);
          this.minRange.setValue(this.variableItem.min_range);
          this.maxRange.setValue(this.variableItem.max_range);
          this.status.setValue(this.variableItem.status);
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
      this.router.navigate(['/variables']);
    }
  }

  validateName(): boolean {
    if (this.name !== '') {
      this.typing = false;
      return this.getNamesOfVariables();
    }
    return false;
  }
  getNamesOfVariables(): boolean {
    this._variableService.loadVariables().toPromise().then(data => {
      if (data.success) {
        const variableList: VariableI[] = data.result;
        for (let variable of variableList) {
          if (this.name.value == variable.name) {
            this.validName = false;
            const toast: NgbToast = {
              toastType:  NgbToastType.Danger,
              text: `${CommonConstants.VARIABLE_ALREADY_EXISTS_ERROR_MESSAGE} ${this.name.value}`,
              dismissible:  true,
              timeInSeconds: 5
            }
            this._toastService.show(toast);
            return false;
          }
        }
        this.validName = true;
        return true;
      } else {
        this._authService.getErrorTable();
      }
      this.validName = false;
    }, error => {
      this._authService.getErrorToken(error);
    })
    .catch(err => {
        return false;
      });
    return false;
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
    this._variableService.createVariable(this.variableFormGroup.value).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.VARIABLE_MESSAGE} ${this.variableFormGroup.value.name} ${CommonConstants.SUCCESSFUL_CREATE_PROCESS_TEXT}`
        });
        this.router.navigate(['/variables']);
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
    this.variableFormGroup.value.id = this.variableItem.id;
    this.variableFormGroup.value._uuid = this.variableItem._uuid;
    this._variableService.updateVariable(this.variableFormGroup.value).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.VARIABLE_MESSAGE} ${this.variableItem.name} ${CommonConstants.SUCCESSFUL_UPDATE_PROCESS_TEXT}`
        });
        this.router.navigate(['/variables']);
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
        this.router.navigate(['/variables']);
      }
    });
  }

}
