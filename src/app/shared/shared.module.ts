import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoadingComponent,
  ],
  exports: [
    LoadingComponent,
  ]
})
export class SharedModule { }
