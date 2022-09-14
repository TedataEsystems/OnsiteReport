import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDailyOperationComponent } from './components/add-daily-operation/add-daily-operation.component';
import { DailyOperationComponent } from './components/daily-operation/daily-operation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LogsComponent } from './components/logs/logs.component';
import { OperatorComponent } from './components/operator/operator.component';
import { PopNameAbbreviationsComponent } from './components/pop-name-abbreviations/pop-name-abbreviations.component';
import { PopNameComponent } from './components/pop-name/pop-name.component';
import { RemedyActionComponent } from './components/remedy-action/remedy-action.component';
import { StatusComponent } from './components/status/status.component';
import { TechNameComponent } from './components/tech-name/tech-name.component';
import { TestComponent } from './components/test/test.component';
import { TransmissionMediaComponent } from './components/transmission-media/transmission-media.component';
import { ZoneNameComponent } from './components/zone-name/zone-name.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './shared/components/login/login.component';
import { AuthGuardAdminServices } from './shared/modules/AuthGuardAdminServices';
import { AuthGuardService } from './shared/modules/AuthGuardService';

const routes: Routes = [
  {
    path:'login',
  component:LoginComponent,
 },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: LayoutComponent,


    children: [{
      path: '',
      component: DashboardComponent,

    },
    {
      path: 'dailey',
      component: DailyOperationComponent,
      canActivate:[AuthGuardService]
    },
    {
      path: 'popNameAbbreviations',
      component: PopNameAbbreviationsComponent,
      canActivate:[AuthGuardService]
    },
    {
      path: 'operator',
      component: OperatorComponent,
      canActivate:[AuthGuardAdminServices]
    },
    {
      path: 'popName',
      component: PopNameComponent,
      canActivate:[AuthGuardAdminServices]
    },
    {
      path: 'zoneName',
      component: ZoneNameComponent,
      canActivate:[AuthGuardAdminServices]
    },
    {
      path: 'transmissionMedia',
      component: TransmissionMediaComponent,
      canActivate:[AuthGuardAdminServices]
    },
    {
      path: 'techName',
      component: TechNameComponent,
      canActivate:[AuthGuardAdminServices]
    },
    {
      path: 'status',
      component: StatusComponent,
      canActivate:[AuthGuardAdminServices]
    },
    {
      path: 'remedyAction',
      component: RemedyActionComponent,
      canActivate:[AuthGuardAdminServices]
    },
    {
      path: 'logs',
      component: LogsComponent,
      canActivate:[AuthGuardAdminServices]
    },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
