import { IdSenderService } from 'src/app/services/id-sender.service';
import { NgbToast, NgbToastType, NgbToastService } from 'ngb-toast';
import { CrudEmployeeService } from './../../../services/crud-employee.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeI } from '../../../models/employee'
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { CommonConstants } from 'src/app/constants/common-constants';

@Component({
  selector: 'fvm-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit, AfterViewInit {

  employeesList: Array<EmployeeI> = [];
  displayedColumns: string[] = ['select', 'id', 'name', 'position', 'email', 'weight', 'height'];
  dataSource = new MatTableDataSource<EmployeeI>([]);
  selection = new SelectionModel<EmployeeI>(true, []);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _employeeService: CrudEmployeeService,
    private _authService: AuthService, private _toastService: NgbToastService,
    private _liveAnnouncer: LiveAnnouncer, private _router: Router, private _idSender: IdSenderService,
    private _changeDetectorRefs: ChangeDetectorRef) { }


  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.getEmployees().then(()=> {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this._changeDetectorRefs.detectChanges();
    });
  }

  getEmployees(): Promise<void> {
    return this._employeeService.loadEmployees().toPromise()
      .then(data => {
        if (data.success) {
          this.employeesList = data.result;
          this.dataSource = new MatTableDataSource<EmployeeI>(this.employeesList);
        } else {
          this._authService.getErrorTable();
        }
      },
      error => {
        this._authService.getErrorToken(error);
      }).catch(err => {

      })
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EmployeeI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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

  addData() {
    this._router.navigate([`/form-employee`]);
  }

  editData() {
    const idToSend: number = !!this.selection.selected[0].id ? this.selection.selected[0].id : 0;
    const uuidToSend: string = !!this.selection.selected[0]._uuid ? this.selection.selected[0]._uuid : '';
    this._idSender.sendId(idToSend);
    this._idSender.sendUUID(uuidToSend);
    this._router.navigate([`/edit-employee`]);
  }

  removeData() {
    const selectedEmployees: Array<EmployeeI>= this.selection.selected;
    const promises: any[] = [];
    selectedEmployees.forEach(employee => {
      promises.push(new Promise((resolve, reject) => {
        resolve(this.deleteEmployee(employee));
      }));
    });
    Promise.all(promises).then(values => {
      this.ngOnInit();
      this.selection.clear();
    }).catch(err => {
      this._authService.getErrorTable();
    });
  }

  /*Metodo para dar de baja*/
  deleteEmployee(employee: EmployeeI): any {
    const params = new HttpParams().append('id', employee._uuid || '');
    return this._employeeService.deleteEmployee(params).toPromise()
    .then(data => {
      if (data.success) {
        const toast: NgbToast = {
          toastType:  NgbToastType.Success,
          text: `${CommonConstants.EMPLOYEE_MESSAGE} ${employee.name} ${employee.surname} ${CommonConstants.SUCCESSFUL_DELETE_PROCESS_TEXT}`,
          dismissible:  true,
          timeInSeconds: 5
        }
        this._toastService.show(toast);
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
