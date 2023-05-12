import { AuthService } from './../../../services/auth.service';
import { IdSenderService } from 'src/app/services/id-sender.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { VariableI, VariableRangeI } from 'src/app/models/variable';
import { CrudVariableService } from 'src/app/services/crud-variable.service';
import { HttpParams } from '@angular/common/http';
import { NgbToast, NgbToastType, NgbToastService } from 'ngb-toast';
import Swal from 'sweetalert2';
import { CommonConstants } from './../../../constants/common-constants';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'fvm-variable-form',
  templateUrl: './variable-form.component.html',
  styleUrls: ['./variable-form.component.scss']
})
export class VariableFormComponent implements OnInit {
  maxDate: Date = new Date();
  variableFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required, Validators.maxLength(60)]),
    data_type: new UntypedFormControl('DEC', Validators.maxLength(3)),
    measurement_unit: new UntypedFormControl('', Validators.maxLength(100)),
    min_range: new UntypedFormControl(null, null),
    max_range: new UntypedFormControl(null, null),
    has_range_for_age: new UntypedFormControl(false, null),
    status: new UntypedFormControl(true, null)
  }, {validators: this.hasValidRanges()});
  /* Elemento de variable por defecto */
  variableItem!: VariableI;

  variableRanges: VariableRangeI[] = [];

  variableRangesDummie: VariableRangeI[] = [{
    _uuid: '',
    id: 0,
    variable_id: this._idSender.id,
    min_age: 0,
    max_age: 0,
    min_range: 0,
    max_range: 0
  }];
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
      this.loadInfoInsideForm(this._idSender._uuid).then(()=> {
        this.loadRanges(this._idSender._uuid);
      });

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
  get status(): any {
    return this.variableFormGroup.get('status');
  }
  get hasRangeForAge(): any {
    return this.variableFormGroup.get('has_range_for_age');
  }
  get minRange(): any {
    return this.variableFormGroup.get('min_range');
  }
  get maxRange(): any {
    return this.variableFormGroup.get('max_range');
  }

  async loadInfoInsideForm(_uuid: string): Promise<any> {
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
          this.hasRangeForAge.setValue(this._idSender.hasRangeForAge)
          this.status.setValue(this.variableItem.status);
          this.loaded = true;
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
      this.router.navigate(['/variables']);
    }
  }

  loadRanges(_uuid: string): any {
    if (!!_uuid) {
      const params = new HttpParams().append('id', _uuid);
      return this._variableService.loadVariableRanges(params).toPromise().then(data => {
        if (data.success) {
          this.variableRanges = data.result.sort((a: VariableRangeI, b: VariableRangeI) => {
            return (a.min_age - b.min_age);
          });
          if (this._idSender.hasRangeForAge) {
            this.variableRanges = this.variableRanges.concat(this.variableRangesDummie);
          }
          if (!this._idSender.hasRangeForAge && this.variableRanges.length == 1 &&
            this.variableRanges[0].min_age == 0 && this.variableRanges[0].max_age == 150) {
            this.minRange.setValue(this.variableRanges[0].min_range);
            this.maxRange.setValue(this.variableRanges[0].max_range);
          }
        } else {
          this._authService.getErrorTable();
        }
      },
      error => {
        this._authService.getErrorToken(error);
      }).catch(err => {

      })
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

  onCreate(toContinue = false) {
    this.loaded = false;
    //Crear variable
    const variableItem: VariableI = {
      name: this.variableFormGroup.value.name,
      data_type: this.variableFormGroup.value.data_type,
      measurement_unit: this.variableFormGroup.value.measurement_unit,
      status: this.variableFormGroup.value.status
    }
    this._variableService.createVariable(variableItem).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.VARIABLE_MESSAGE} ${variableItem.name} ${CommonConstants.SUCCESSFUL_CREATE_PROCESS_TEXT}`
        });
        if (toContinue) {
          this._idSender.sendId(data.result.insertId);
          const params = new HttpParams().append('id', data.result.insertId);
          this._variableService.loadVariableUUID(params).toPromise().then(data => {
            if (data.success) {
              this._idSender.sendUUID(data.result._uuid);
              this.router.navigate([`/edit-variable`]);
            } else {
              //Error de proceso
              this._authService.getErrorProccess(data);
            }
          }, error => {
            this._authService.getErrorToken(error);
          }).catch(err => {

          });
        } else {
          this.router.navigate(['/variables']);
        }
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
    const variableItem: VariableI = {
      id: this.variableFormGroup.value.id,
      _uuid: this.variableFormGroup.value._uuid,
      name: this.variableFormGroup.value.name,
      data_type: this.variableFormGroup.value.data_type,
      measurement_unit: this.variableFormGroup.value.measurement_unit,
      status: this.variableFormGroup.value.status
    }
    this._variableService.updateVariable(variableItem).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.VARIABLE_MESSAGE} ${variableItem.name} ${CommonConstants.SUCCESSFUL_UPDATE_PROCESS_TEXT}`
        });
        if (!this.hasRangeForAge.value && !!this.minRange.value && !!this.maxRange.value) {
          let variableRange: VariableRangeI = {
            variable_id: this._idSender.id,
            min_age: 0,
            max_age: 150,
            min_range: this.minRange.value,
            max_range: this.maxRange.value
          }
          if (this.variableRanges.length == 1) {
            variableRange._uuid = this.variableRanges[0]._uuid;
            this.updateRange(variableRange);
          } else {
            this.addRange(variableRange);
          }
        }
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

  removeRange(variableRangeUuid: string, showChange: boolean = true) {
    if (variableRangeUuid) {
      const params = new HttpParams()
        .append('id', variableRangeUuid);
      this._variableService.deleteVariableRange(params).toPromise().then(data => {
        if (data.success) {
          this.variableRanges = [{
            _uuid: '',
            id: 0,
            variable_id: this._idSender.id,
            min_age: 0,
            max_age: 0,
            min_range: 0,
            max_range: 0
          }];
          this.loadRanges(this._idSender._uuid);
          if (showChange) {
            const toast: NgbToast = {
              toastType:  NgbToastType.Success,
              text: `${CommonConstants.VARIABLE_RANGE_MESSAGE} ${CommonConstants.SUCCESSFUL_DELETE_PROCESS_TEXT}`,
              dismissible:  true,
              timeInSeconds: 5
            }
            this._toastService.show(toast);
          }
          return data;
        } else {
          this._authService.getErrorTable();
        }
      },
      error => {
        this._authService.getErrorToken(error);
      }).catch(err => {

      })
    }
  }

  updateRange(range: VariableRangeI) {
    if (range) {
      let variableRange: VariableRangeI = {
        _uuid: range._uuid,
        variable_id: this._idSender.id,
        min_age: range.min_age,
        max_age: range.max_age,
        min_range: range.min_range,
        max_range: range.max_range
      }
      this._variableService.updateVariableRange(variableRange).toPromise().then(data => {
        if (data.success) {
          const toast: NgbToast = {
            toastType:  NgbToastType.Success,
            text: `${CommonConstants.VARIABLE_RANGE_MESSAGE} ${CommonConstants.SUCCESSFUL_UPDATE_PROCESS_TEXT}`,
            dismissible:  true,
            timeInSeconds: 5
          }
          this._toastService.show(toast);
        } else {
          this._authService.getErrorTable();
        }
      },
      error => {
        this._authService.getErrorToken(error);
      }).catch(err => {

      });
    }
  }

  addRange(range: VariableRangeI) {
    if (range) {
      let variableRange: VariableRangeI = {
        variable_id: this._idSender.id,
        min_age: range.min_age,
        max_age: range.max_age,
        min_range: range.min_range,
        max_range: range.max_range
      }

      if (this.variableRanges.length == 1 && this.variableRanges[0].min_age == 0 && this.variableRanges[0].max_age == 150 && !!this.variableRanges[0]._uuid) {
        this.removeRange(this.variableRanges[0]._uuid, false);
      }
      this._variableService.createVariableRange(variableRange).toPromise().then(data => {
        if (data.success) {
          this.variableRanges = [{
            _uuid: '',
            id: 0,
            variable_id: this._idSender.id,
            min_age: 0,
            max_age: 0,
            min_range: 0,
            max_range: 0
          }];
          this.loadRanges(this._idSender._uuid);
          const toast: NgbToast = {
            toastType:  NgbToastType.Success,
            text: `${CommonConstants.VARIABLE_RANGE_MESSAGE} ${CommonConstants.SUCCESSFUL_CREATE_PROCESS_TEXT}`,
            dismissible:  true,
            timeInSeconds: 5
          }
          this._toastService.show(toast);
        } else {
          this._authService.getErrorTable();
        }
      },
      error => {
        this._authService.getErrorToken(error);
      }).catch(err => {

      });
    }
  }

  hasAgeRangeChange(event: MatCheckboxChange) {
    if (!!this.variableRanges[0] && !!this.variableRanges[0]._uuid) {
      if (!event.checked) {
        this._idSender.sendHasRangeForAge(false);
        for (let variableRange of this.variableRanges) {
          if (variableRange._uuid) {
            this.removeRange(variableRange._uuid);
          }
        }
      } else if (event.checked) {
        this._idSender.sendHasRangeForAge(true);
        this.removeRange(this.variableRanges[0]._uuid);
        this.minRange.setValue('');
        this.maxRange.setValue('');
      }
    } else {
      if (!event.checked) {
        this._idSender.sendHasRangeForAge(false);
      } else {
        this._idSender.sendHasRangeForAge(true);
        this.variableRanges = this.variableRangesDummie;
        this.minRange.setValue('');
        this.maxRange.setValue('');
      }
    }
  }

  hasValidRanges(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isInvalid = control.value['min_range'] > control.value['max_range'];
      return isInvalid ? {validRanges: false} : null;
    };
  };
}
