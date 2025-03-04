import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { KycComponent } from './components/kyc/kyc.component';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { driverLoggedGuard } from '../../core/guards/driver-logged.guard';

const routes: Routes = [
  { path: '', redirectTo: 'kyc', pathMatch: 'full' },
  { path: 'kyc', component: KycComponent, canActivate: [driverLoggedGuard] },
  { path: 'shifts', component: ShiftsComponent, canActivate: [driverLoggedGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }