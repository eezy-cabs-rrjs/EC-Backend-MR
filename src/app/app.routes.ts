import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
     { path: '', redirectTo: 'user', pathMatch: 'full' },
     { path: 'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },
     { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
     { path: 'driver', loadChildren: () => import('./features/driver/driver.module').then(m => m.DriverModule) },
     { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
     { path: 'rides', loadChildren: () => import('./features/rides/rides.module'). then(m => m.RidesModule) },
     { path:'**', redirectTo:'user', pathMatch: 'full' }
];
   
@NgModule({
     imports: [RouterModule.forRoot(routes)],
     exports: [RouterModule]
})

export class AppRoutingModule {}