import { AuthService } from './../../../services/auth.service';
import { IdSenderService } from 'src/app/services/id-sender.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EmployeeI } from 'src/app/models/employee';
import { CrudEmployeeService } from 'src/app/services/crud-employee.service';
import { HttpParams } from '@angular/common/http';
import { NgbToast, NgbToastType, NgbToastService } from 'ngb-toast';
import Swal from 'sweetalert2';
import { CommonConstants } from './../../../constants/common-constants';

@Component({
  selector: 'fvm-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  maxDate: Date = new Date();
  employeeFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    second_name: new FormControl('', Validators.maxLength(30)),
    surname: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    second_surname: new FormControl('', Validators.maxLength(30)),
    document_type: new FormControl('CC', null),
    document: new FormControl(null, Validators.required),
    position: new FormControl('', Validators.maxLength(100)),
    date_of_birth: new FormControl('', Validators.required),
    address: new FormControl('', Validators.maxLength(200)),
    phone: new FormControl('', Validators.maxLength(20)),
    cellphone: new FormControl('', Validators.maxLength(20)),
    email: new FormControl('@', [Validators.required, Validators.email, Validators.maxLength(100)]),
    height: new FormControl(null, Validators.required),
    weight: new FormControl(null, Validators.required)
  });
  /* Elemento de empleado por defecto */
  employeeItem!: EmployeeI;
  /*Validaciones del formulario */
  validDocument = true;
  typing = false;
  loaded = false;
  router: Router

  constructor(_router: Router, private _idSender: IdSenderService, private _authService: AuthService,
    private _employeeService: CrudEmployeeService, private _toastService: NgbToastService) {
    this.router = _router;
  }

  ngOnInit(): void {
    /*Si es formulario de editar*/
    if (this.router.url === '/edit-employee') {
      this.loadInfoInsideForm(this._idSender._uuid);
    }
    /*Si es formulario de crear*/
    else {
      this.loaded = true;
    }
  }

  get name(): any {
    return this.employeeFormGroup.get('name');
  }
  get secondName(): any {
    return this.employeeFormGroup.get('second_name');
  }
  get surname(): any {
    return this.employeeFormGroup.get('surname');
  }
  get secondSurname(): any {
    return this.employeeFormGroup.get('second_surname');
  }
  get documentType(): any {
    return this.employeeFormGroup.get('document_type');
  }
  get document(): any {
    return this.employeeFormGroup.get('document');
  }
  get position(): any {
    return this.employeeFormGroup.get('position');
  }
  get dateOfBirth(): any {
    return this.employeeFormGroup.get('date_of_birth');
  }
  get address(): any {
    return this.employeeFormGroup.get('address');
  }
  get phone(): any {
    return this.employeeFormGroup.get('phone');
  }
  get cellphone(): any {
    return this.employeeFormGroup.get('cellphone');
  }
  get email(): any {
    return this.employeeFormGroup.get('email');
  }
  get weight(): any {
    return this.employeeFormGroup.get('weight');
  }
  get height(): any {
    return this.employeeFormGroup.get('height');
  }

  loadInfoInsideForm(_uuid: string): any {
    //Si no tiene un id, debe devolverse a la dataTable de empleados
    if (_uuid) {
      const params = new HttpParams()
        .append('id', _uuid);
      this._employeeService.loadEmployee(params)
      .subscribe(data => {
        if (data.success) {
          this.employeeItem = data.result;
          this.name.setValue(this.employeeItem.name);
          this.secondName.setValue(this.employeeItem.second_name);
          this.surname.setValue(this.employeeItem.surname);
          this.secondSurname.setValue(this.employeeItem.second_surname);
          this.documentType.setValue(this.employeeItem.document_type);
          this.document.setValue(this.employeeItem.document);
          this.position.setValue(this.employeeItem.position);
          this.dateOfBirth.setValue(this.employeeItem.date_of_birth);
          this.address.setValue(this.employeeItem.address);
          this.phone.setValue(this.employeeItem.phone);
          this.cellphone.setValue(this.employeeItem.cellphone);
          this.email.setValue(this.employeeItem.email);
          this.height.setValue(this.employeeItem.height);
          this.weight.setValue(this.employeeItem.weight);
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
      this.router.navigate(['/employees']);
    }
  }

  validateDocument(): boolean {
    if (this.document !== '') {
      this.typing = false;
      return this.getDocumentsOfEmployees();
    }
    return false;
  }
  getDocumentsOfEmployees(): boolean {
    this._employeeService.loadEmployees().toPromise().then(data => {
      if (data.success) {
        const employeeList: EmployeeI[] = data.result;
        for (let employee of employeeList) {
          if (this.document.value == employee.document) {
            this.validDocument = false;
            const toast: NgbToast = {
              toastType:  NgbToastType.Danger,
              text: `${CommonConstants.EMPLOYEE_ALREADY_EXISTS_ERROR_MESSAGE} ${this.document.value}`,
              dismissible:  true,
              timeInSeconds: 5
            }
            this._toastService.show(toast);
            return false;
          }
        }
        this.validDocument = true;
        return true;
      } else {
        this._authService.getErrorTable();
      }
      this.validDocument = false;
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
    //Crear empleado
    this._employeeService.createEmployee(this.employeeFormGroup.value).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.EMPLOYEE_MESSAGE} ${this.employeeFormGroup.value.name} ${this.employeeFormGroup.value.surname} ${CommonConstants.SUCCESSFUL_CREATE_PROCESS_TEXT}`
        });
        this.router.navigate(['/employees']);
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
    //Crear empleado
    this.employeeFormGroup.value.id = this.employeeItem.id;
    this.employeeFormGroup.value._uuid = this.employeeItem._uuid;
    this._employeeService.updateEmployee(this.employeeFormGroup.value).toPromise().then(data => {
      if (data.success) {
        Swal.fire({
          type: 'success',
          title: CommonConstants.SUCCESSFUL_PROCESS_TITLE,
          text: `${CommonConstants.EMPLOYEE_MESSAGE} ${this.employeeItem.name} ${this.employeeItem.surname} ${CommonConstants.SUCCESSFUL_UPDATE_PROCESS_TEXT}`
        });
        this.router.navigate(['/employees']);
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
        this.router.navigate(['/employees']);
      }
    });
  }

}
