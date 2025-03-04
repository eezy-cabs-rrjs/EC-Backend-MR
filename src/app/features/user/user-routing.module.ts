import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { BookCabComponent } from './components/book-cab/book-cab.component';
import { ProfileComponent } from './components/profile/profile.component';
import { userLoggedGuard } from '../../core/guards/user-logged.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { RidingComponent } from './components/riding/riding.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent, 
    canActivate: [roleGuard]
 },
  { path: 'book-cab', component: BookCabComponent, canActivate: [userLoggedGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [userLoggedGuard]  },
  { path: 'riding', component: RidingComponent, canActivate: [userLoggedGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
