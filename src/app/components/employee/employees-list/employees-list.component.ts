import { NgbToast, NgbToastType, NgbToastService } from 'ngb-toast';
import { CrudEmployeeService } from './../../../services/crud-employee.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeI } from '../../../models/employee'
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'fvm-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit, AfterViewInit {

  employeesList: Array<EmployeeI> = [];
  displayedColumns: string[] = ['select', 'name', 'position', 'email', 'weight', 'height'];
  dataSource = new MatTableDataSource<EmployeeI>([]);
  selection = new SelectionModel<EmployeeI>(true, []);
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _employeeService: CrudEmployeeService,
    private _authService: AuthService, private _toastService: NgbToastService,
    private _liveAnnouncer: LiveAnnouncer) { }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    return this._employeeService.loadEmployees().toPromise()
      .then(data => {
        if (data.success) {
          this.employeesList = data.result;
          this.dataSource = new MatTableDataSource<EmployeeI>(this.employeesList);
        } else {
          Swal.fire({
            type: 'error',
            title: 'Error en la consulta',
            text: 'No fue posible el acceso a la tabla.'
          });
        }
      },
      error => {
        if (error.error.message === 'TokenExpiredError') {
          const toast: NgbToast = {
            toastType:  NgbToastType.Danger,
            text:  "Token ha expirado. Inicie sesión nuevamente.",
            dismissible:  true
          }
          this._toastService.show(toast);
          this._authService.logOutUser();
        } else {
        Swal.fire({
          type: 'error',
          title: 'Error de conexión'
          });
        }
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

}
