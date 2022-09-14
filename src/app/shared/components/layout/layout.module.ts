import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material/material.module';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../navigation/header/header.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from '../navigation/sidebar/sidebar.component';
import { FooteerComponent } from '../navigation/footeer/footeer.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { TestComponent } from 'src/app/components/test/test.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { DeleteComponent } from '../../msg/delete/delete.component';
import { DeleteServiceService } from '../../services/delete-service.service';
import { EmpService } from '../../services/emp.service';
import { NotificationMsgService } from '../../services/notification-msg.service';
import { OperatorComponent } from 'src/app/components/operator/operator.component';
import { PopNameComponent } from 'src/app/components/pop-name/pop-name.component';
import { RemedyActionComponent } from 'src/app/components/remedy-action/remedy-action.component';
import { StatusComponent } from 'src/app/components/status/status.component';
import { TechNameComponent } from 'src/app/components/tech-name/tech-name.component';
import { TransmissionMediaComponent } from 'src/app/components/transmission-media/transmission-media.component';
import { PaginationService } from 'src/app/Services/pagination.service';
import { DailyOperationComponent } from 'src/app/components/daily-operation/daily-operation.component';
import { AddDailyOperationComponent } from 'src/app/components/add-daily-operation/add-daily-operation.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
//import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from 'ngx-mat-datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EditDailyOpertionComponent } from 'src/app/components/edit-daily-opertion/edit-daily-opertion.component';
import { ZoneNameComponent } from 'src/app/components/zone-name/zone-name.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { ChartsModule } from 'ng2-charts';
import { LoaderComponent } from '../loader/loader.component';
import { LogsComponent } from 'src/app/components/logs/logs.component';

import { PopNameAbbreviationsComponent } from 'src/app/components/pop-name-abbreviations/pop-name-abbreviations.component';
import { SlaFormatPipe } from 'src/app/components/daily-operation/sla-format.pipe';
import { NgSelect2Module } from 'ng-select2';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooteerComponent,
    DashboardComponent,
    TestComponent,
    DeleteComponent,
    OperatorComponent,
    PopNameComponent,
    RemedyActionComponent,
    StatusComponent,
    TechNameComponent,
    TransmissionMediaComponent,
    DailyOperationComponent,
    AddDailyOperationComponent,
    EditDailyOpertionComponent,
    ZoneNameComponent,
    LoaderComponent,
    LogsComponent,
    PopNameAbbreviationsComponent,
    SlaFormatPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ScrollingModule,
    BrowserModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    ChartsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    NgSelect2Module

  ],
  providers: [Title, DeleteServiceService, DeleteServiceService, EmpService, NotificationMsgService, PaginationService]
})
export class LayoutModule { }
