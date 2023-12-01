import { CrudReportService } from 'src/app/services/crud-report.service';
import { CrudVariableService } from 'src/app/services/crud-variable.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CrudEmployeeService } from 'src/app/services/crud-employee.service';
import { VariableI, VariableRangeI } from 'src/app/models/variable';
import { EmployeeI } from 'src/app/models/employee';
import { NgbToast, NgbToastService, NgbToastType } from 'ngb-toast';
import { CommonConstants } from 'src/app/constants/common-constants';
import { AuthService } from 'src/app/services/auth.service';
import { SocketWebService } from 'src/app/services/socket-web.service';
import { HttpParams } from '@angular/common/http';
import { UploadedFileI } from 'src/app/models/uploadedFile';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { DataForLineChartI } from 'src/app/models/dataForLineChart';
import { values } from 'lodash';

@Component({
  selector: 'fvm-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportFormGroup = new UntypedFormGroup({
    employee_uuid: new UntypedFormControl('', [Validators.required]),
    variable_uuid: new UntypedFormControl('', [Validators.required]),
    since: new UntypedFormControl('', [Validators.required]),
  });

  loaded = true;
  variableOptions: VariableI[] = [];
  employeeOptions: EmployeeI[] = [];
  variableRanges: VariableRangeI[] = [];
  dataForLineChart: any[] = [];
  minRange: number = 0;
  maxRange: number = 0;

  uploadedFileList: Array<UploadedFileI> = [];
  displayedColumns: string[] = ['id', 'device_name', 'value', 'registered_at', 'exceeds_range'];
  dataSource = new MatTableDataSource<UploadedFileI>([]);
  selection = new SelectionModel<UploadedFileI>(false, []);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _reportService: CrudReportService, private _variableService: CrudVariableService,
    private _employeeService: CrudEmployeeService, private _toastService: NgbToastService,
    private _authService: AuthService, private _socketWebService: SocketWebService,
    private _changeDetectorRefs: ChangeDetectorRef, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.loadVariableOptions();
    this.loadEmployeeOptions();

  }

  ngAfterViewInit(): void {
    this._socketWebService.outReportEvent.subscribe(res => {
      this.loadReportByEmployeeAndVariable();
    })
  }

  validateValueInsideVariableRange(value: number, employeeAge: number): boolean {
    for (let range of this.variableRanges) {
      if (employeeAge >= range.min_age && employeeAge <= range.max_age) {
        this.minRange = range.min_range;
        this.maxRange = range.max_range;
        if (value > range.max_range || value < range.min_age) {
          return false;
        } else {
          return true;
        }
      }
    }
    return true;
  }


  getEmployeeAgeVsRecordDate(dateOfBirth: Date, recordDate: Date): number {
    const recordDay = new Date(recordDate);
    const birth = new Date(dateOfBirth);
    let age = recordDay.getFullYear() - birth.getFullYear();
    const month = recordDay.getMonth() - birth.getMonth();
    if (month < 0 || (month === 0 && recordDay.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  onSearch(): void {
    this.loadReportByEmployeeAndVariable();
  }

  get employeeUuid(): any {
    return this.reportFormGroup.get('employee_uuid');
  }

  get variableUuid(): any {
    return this.reportFormGroup.get('variable_uuid');
  }

  get since(): any {
    return this.reportFormGroup.get('since');
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort | any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadReportByEmployeeAndVariable(): Promise<void> {
    this.loaded = false;
    const params = new HttpParams()
      .append('employee_uuid', this.employeeUuid.value)
      .append('variable_uuid', this.variableUuid.value)
      .append('interval', this.since.value);
    return this._reportService.loadReports(params).toPromise()
    .then(data => {
      if (data.success) {
        const copyOfData: string = JSON.stringify(data.result);
        this.uploadedFileList = [...data.result];

        this.uploadedFileList.forEach(registeredAtItem => {
          const dateOfBirthEmployee = this.employeeOptions.filter(employee=> {
            return employee._uuid == this.employeeUuid.value;
          })[0].date_of_birth;
          const employeeAge = this.getEmployeeAgeVsRecordDate(dateOfBirthEmployee, new Date(registeredAtItem.registered_at));
          const exceedsRange = this.validateValueInsideVariableRange(registeredAtItem.value, employeeAge);
          registeredAtItem.exceeds_range = !!exceedsRange;
          registeredAtItem.registered_at = new Date(registeredAtItem.registered_at).toLocaleString('es-ES',
            { weekday:"long", year:"numeric", month:"short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true});
        })
        this.dataSource = new MatTableDataSource<UploadedFileI>(this.uploadedFileList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this._changeDetectorRefs.detectChanges();
        this.dataForLineChart = this.getDataForLineChart(JSON.parse(copyOfData));
        this.loaded = true;
      } else {
        this._authService.getErrorTable();
      }
    },
    error => {
      this._authService.getErrorToken(error);
    }).catch(err => {

    })
  }

  getDataForLineChart(data: any[]): DataForLineChartI[] {
    let dataFormatted: DataForLineChartI[] = [];
    dataFormatted.push({name: 'Rango Mínimo', series: []});
    const selectedEmployee = this.employeeOptions.filter(employee=> {
      return employee._uuid == this.employeeUuid.value;
    })[0];
    dataFormatted.push({name: `${selectedEmployee.name} ${selectedEmployee.second_name} ${selectedEmployee.surname} ${selectedEmployee.second_surname}`, series: []});
    dataFormatted.push({name: 'Rango Máximo', series: []});
    const now = new Date();
    const numberOfMlSeconds = now.getTime();
    for (let i = 120; i > 0; i--) {
      const removeMlSeconds = i * 1000;
      const newDateObj = new Date(numberOfMlSeconds - removeMlSeconds);
      let elemName: string = `${newDateObj.getHours()}:`;
      elemName += `${newDateObj.getMinutes() < 10 ? '0'+newDateObj.getMinutes() : newDateObj.getMinutes()}:`;
      elemName += `${newDateObj.getSeconds() < 10 ? '0'+newDateObj.getSeconds() : newDateObj.getSeconds()}`;
      dataFormatted[0].series.push({name: elemName, value: this.minRange});
      dataFormatted[2].series.push({name: elemName, value: this.maxRange});
      const dataSync: UploadedFileI = data.filter(elem => {
        const registeredDate = new Date(elem.registered_at);
        return registeredDate.getDate() == newDateObj.getDate() &&
          registeredDate.getMonth() == newDateObj.getMonth() &&
          registeredDate.getFullYear() == newDateObj.getFullYear() &&
          registeredDate.getHours() == newDateObj.getHours() &&
          registeredDate.getMinutes() == newDateObj.getMinutes() &&
          registeredDate.getSeconds() == newDateObj.getSeconds();
      })[0];

      if (!!dataSync) {
        dataFormatted[1].series.push({name: elemName, value: dataSync.value})
      } else {
        dataFormatted[1].series.push({name: elemName, value: 0})
      }
    }
    return dataFormatted;
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

  onChangeVariableSelect(): void {
    const params = new HttpParams()
      .append('id', this.variableUuid.value);
    this._variableService.loadVariableRanges(params).toPromise().then(data => {
      if (data.success) {
        this.variableRanges = data.result;
      }else {
        this._authService.getErrorTable();
      }
    },
    error => {
      this._authService.getErrorToken(error);
    }).catch(err => {

    });

  }

  loadEmployeeOptions(): any {
    this._employeeService.loadEmployees().toPromise().then(data => {
      if (data.success) {
        this.employeeOptions = data.result;
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

  onChangeEmployeeSelect(): void {

  }

}
