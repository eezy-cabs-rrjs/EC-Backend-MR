import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: ':rideId/chat', component: ChatComponent
     //  canActivate: [NotLoggedGuard]
  },
  { path: '', redirectTo: '/user', pathMatch: 'full' }, // Handle /rides
  { path: '**', redirectTo: '/user' } // Handle invalid routes under /rides
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RidesRoutingModule { }
  