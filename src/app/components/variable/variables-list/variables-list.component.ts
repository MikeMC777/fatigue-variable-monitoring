import { IdSenderService } from 'src/app/services/id-sender.service';
import { NgbToast, NgbToastType, NgbToastService } from 'ngb-toast';
import { CrudVariableService } from './../../../services/crud-variable.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { VariableI } from '../../../models/variable'
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { CommonConstants } from 'src/app/constants/common-constants';

@Component({
  selector: 'fvm-variables-list',
  templateUrl: './variables-list.component.html',
  styleUrls: ['./variables-list.component.scss']
})
export class VariablesListComponent implements OnInit, AfterViewInit {

  variablesList: Array<VariableI> = [];
  displayedColumns: string[] = ['select', 'id', 'name', 'data_type', 'measurement_unit', 'min_range', 'max_range', 'status'];
  dataSource = new MatTableDataSource<VariableI>([]);
  selection = new SelectionModel<VariableI>(true, []);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _variableService: CrudVariableService,
    private _authService: AuthService, private _toastService: NgbToastService,
    private _liveAnnouncer: LiveAnnouncer, private _router: Router, private _idSender: IdSenderService,
    private _changeDetectorRefs: ChangeDetectorRef) { }


  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.getVariables().then(()=> {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this._changeDetectorRefs.detectChanges();
    });
  }

  getVariables(): Promise<void> {
    return this._variableService.loadVariables().toPromise()
      .then(data => {
        if (data.success) {
          this.variablesList = data.result;
          this.dataSource = new MatTableDataSource<VariableI>(this.variablesList);
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
  checkboxLabel(row?: VariableI): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id ? + 1 : 1}`;
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
    this._router.navigate([`/form-variable`]);
  }

  editData() {
    const idToSend: number = !!this.selection.selected[0].id ? this.selection.selected[0].id : 0;
    const uuidToSend: string = !!this.selection.selected[0]._uuid ? this.selection.selected[0]._uuid : '';
    this._idSender.sendId(idToSend);
    this._idSender.sendUUID(uuidToSend);
    this._router.navigate([`/edit-variable`]);
  }

  removeData() {
    const selectedVariables: Array<VariableI>= this.selection.selected;
    const promises: any[] = [];
    selectedVariables.forEach(variable => {
      promises.push(new Promise((resolve, reject) => {
        resolve(this.deleteVariable(variable));
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
  deleteVariable(variable: VariableI): any {
    const params = new HttpParams().append('id', variable._uuid || '');
    return this._variableService.deleteVariable(params).toPromise()
    .then(data => {
      if (data.success) {
        const toast: NgbToast = {
          toastType:  NgbToastType.Success,
          text: `${CommonConstants.DEVICE_MESSAGE} ${variable.name} ${CommonConstants.SUCCESSFUL_DELETE_PROCESS_TEXT}`,
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


