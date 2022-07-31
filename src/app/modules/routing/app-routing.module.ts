import { ReportComponent } from './../../components/report/report.component';
import { ProfileComponent } from './../../components/profile/profile.component';
import { FileReadingComponent } from './../../components/file-reading/file-reading.component';
import { TemplateFormComponent } from './../../components/template/template-form/template-form.component';
import { TemplatesListComponent } from './../../components/template/templates-list/templates-list.component';
import { VariableFormComponent } from './../../components/variable/variable-form/variable-form.component';
import { VariablesListComponent } from './../../components/variable/variables-list/variables-list.component';
import { DeviceFormComponent } from './../../components/device/device-form/device-form.component';
import { DevicesListComponent } from './../../components/device/devices-list/devices-list.component';
import { EmployeeFormComponent } from './../../components/employee/employee-form/employee-form.component';
import { EmployeesListComponent } from './../../components/employee/employees-list/employees-list.component';
import { ErrorComponent } from './../../components/error/error.component';
import { HomeComponent } from './../../components/home/home.component';
import { LoginComponent } from './../../components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './../../guards/auth.guards.service';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent,  pathMatch: 'full' },
  /*Se agregan las rutas de empleados */
  { path: 'employees', component: EmployeesListComponent, canActivate: [AuthGuard]},
  { path: 'form-employee', component: EmployeeFormComponent, canActivate: [AuthGuard]},
  { path: 'edit-employee/:id', component: EmployeeFormComponent, canActivate: [AuthGuard]},
  /*Se agregan las rutas de dispositivos */
  { path: 'devices', component: DevicesListComponent, canActivate: [AuthGuard]},
  { path: 'form-device', component: DeviceFormComponent, canActivate: [AuthGuard]},
  { path: 'edit-device', component: DeviceFormComponent, canActivate: [AuthGuard]},
  /*Se agregan las rutas de variables */
  { path: 'variables', component: VariablesListComponent, canActivate: [AuthGuard]},
  { path: 'form-variable', component: VariableFormComponent, canActivate: [AuthGuard]},
  { path: 'edit-variable', component: VariableFormComponent, canActivate: [AuthGuard]},
  /*Se agregan las rutas de plantillas */
  { path: 'templates', component: TemplatesListComponent, canActivate: [AuthGuard]},
  { path: 'form-template', component: TemplateFormComponent, canActivate: [AuthGuard]},
  { path: 'edit-template', component: TemplateFormComponent, canActivate: [AuthGuard]},
  /*Se agregan la ruta de mi perfil */
  { path: 'my-profile', component: ProfileComponent, canActivate: [AuthGuard]},
  /*Se agregan la ruta de lectura de archivo */
  { path: 'file-reading', component: FileReadingComponent, canActivate: [AuthGuard]},
  /*Se agregan la ruta de reportes */
  { path: 'reports', component: ReportComponent, canActivate: [AuthGuard]},
  { path: '404', component: ErrorComponent},
  { path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
