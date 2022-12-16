import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbToastModule } from  'ngb-toast';
import { AppRoutingModule } from './modules/routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { EmployeesListComponent } from './components/employee/employees-list/employees-list.component';
import { EmployeeFormComponent } from './components/employee/employee-form/employee-form.component';
import { DevicesListComponent } from './components/device/devices-list/devices-list.component';
import { DeviceFormComponent } from './components/device/device-form/device-form.component';
import { VariablesListComponent } from './components/variable/variables-list/variables-list.component';
import { VariableFormComponent } from './components/variable/variable-form/variable-form.component';
import { TemplatesListComponent } from './components/template/templates-list/templates-list.component';
import { TemplateFormComponent } from './components/template/template-form/template-form.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FileReadingComponent } from './components/file-reading/file-reading.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { ReportComponent } from './components/report/report.component';
import { HeaderMobileMenuComponent } from './components/header-mobile-menu/header-mobile-menu.component';
import { DeviceEmployeeItemComponent } from './components/employee/device-employee-item/device-employee-item.component';
import { VariableRangeItemComponent } from './components/variable/variable-range-item/variable-range-item.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    EmployeesListComponent,
    EmployeeFormComponent,
    DevicesListComponent,
    DeviceFormComponent,
    VariablesListComponent,
    VariableFormComponent,
    TemplatesListComponent,
    TemplateFormComponent,
    LoginComponent,
    ProfileComponent,
    BreadcrumbComponent,
    FileReadingComponent,
    HomeComponent,
    ErrorComponent,
    ReportComponent,
    HeaderMobileMenuComponent,
    DeviceEmployeeItemComponent,
    VariableRangeItemComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxCaptchaModule,
    NgbToastModule
  ],
  exports: [
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
