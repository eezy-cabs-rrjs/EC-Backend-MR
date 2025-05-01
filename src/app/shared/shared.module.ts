import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { TableComponent } from './components/table/table.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';

@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    LoadingComponent,
    TableComponent,
    HeaderComponent,
    FooterComponent
  ],
  exports: [
    LoadingComponent,
    TableComponent,
    HeaderComponent,
    FooterComponent,
  ]
})
export class SharedModule { }
