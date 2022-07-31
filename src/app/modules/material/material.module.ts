import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
//import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [],
  imports: [
    MatMenuModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatPaginatorModule,
    ClipboardModule,
    MatSnackBarModule,
    MatRippleModule,
    MatDialogModule,
    //NgxSliderModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatTableModule
  ],
  exports: [
    MatMenuModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatPaginatorModule,
    ClipboardModule,
    MatSnackBarModule,
    MatRippleModule,
    MatDialogModule,
    //NgxSliderModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatTableModule
  ]
})
export class MaterialModule { }
