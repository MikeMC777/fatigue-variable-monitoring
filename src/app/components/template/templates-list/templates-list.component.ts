import { IdSenderService } from 'src/app/services/id-sender.service';
import { NgbToast, NgbToastType, NgbToastService } from 'ngb-toast';
import { CrudTemplateService } from 'src/app/services/crud-template.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TemplateI } from '../../../models/template'
import { AuthService } from 'src/app/services/auth.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { CommonConstants } from 'src/app/constants/common-constants';

@Component({
  selector: 'fvm-templates-list',
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss']
})
export class TemplatesListComponent implements OnInit, AfterViewInit {

  templatesList: Array<TemplateI> = [];
  displayedColumns: string[] = ['select', 'id', 'device_name', 'variable_name', 'position'];
  dataSource = new MatTableDataSource<TemplateI>([]);
  selection = new SelectionModel<TemplateI>(true, []);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loaded = false;

  constructor(private _templateService: CrudTemplateService,
    private _authService: AuthService, private _toastService: NgbToastService,
    private _liveAnnouncer: LiveAnnouncer, private _router: Router, private _idSender: IdSenderService,
    private _changeDetectorRefs: ChangeDetectorRef) { }


  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.getTemplates().then(()=> {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this._changeDetectorRefs.detectChanges();
    });
  }

  getTemplates(): Promise<void> {
    return this._templateService.loadTemplates().toPromise()
      .then(data => {
        if (data.success) {
          this.templatesList = data.result;
          this.dataSource = new MatTableDataSource<TemplateI>(this.templatesList);
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
  checkboxLabel(row?: TemplateI): string {
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
    this._router.navigate([`/form-template`]);
  }

  editData() {
    const idToSend: number = !!this.selection.selected[0].id ? this.selection.selected[0].id : 0;
    const uuidToSend: string = !!this.selection.selected[0]._uuid ? this.selection.selected[0]._uuid : '';
    this._idSender.sendId(idToSend);
    this._idSender.sendUUID(uuidToSend);
    this._router.navigate([`/edit-template`]);
  }

  removeData() {
    const selectedTemplates: Array<TemplateI>= this.selection.selected;
    const promises: any[] = [];
    selectedTemplates.forEach(template => {
      promises.push(new Promise((resolve, reject) => {
        resolve(this.deleteTemplate(template));
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
  deleteTemplate(template: TemplateI): any {
    const params = new HttpParams().append('id', template._uuid || '');
    return this._templateService.deleteTemplate(params).toPromise()
    .then(data => {
      if (data.success) {
        const toast: NgbToast = {
          toastType:  NgbToastType.Success,
          text: `${CommonConstants.TEMPLATE_MESSAGE} No. ${template.id} ${CommonConstants.SUCCESSFUL_DELETE_PROCESS_TEXT}`,
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
