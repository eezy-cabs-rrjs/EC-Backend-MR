import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { DriverManagementComponent } from './components/driver-management/driver-management.component';
import { DriverKycComponent } from './components/driver-kyc/driver-kyc.component';
import { KycListComponent } from './components/kyc-list/kyc-list.component';
import { adminLoggedGuard } from '../../core/guards/admin-logged.guard';
import { DriverComponent } from './components/driver/driver.component';
import { queryParamGuard } from '../../core/guards/query-param.guard';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserManagementComponent, canActivate: [adminLoggedGuard] },
  { path: 'drivers', component: DriverManagementComponent, canActivate: [adminLoggedGuard] },
  { path: 'kyc-list', component: KycListComponent, canActivate: [adminLoggedGuard] },
  { path: 'driver-kyc', component: DriverKycComponent, canActivate: [adminLoggedGuard] },
  { path: 'driver', component: DriverComponent, canActivate: [adminLoggedGuard, queryParamGuard] },
  { path: '**', redirectTo: 'users', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
