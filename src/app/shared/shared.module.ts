import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { TableComponent } from './components/table/table.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { StorageService } from './services/storage.service';
import { OtpService } from './services/otp.service';
import { TimerService } from './services/timer.service';
import { DialogService } from './services/dialog.service';
import { NotificationService } from './services/notification.service';
import { ImageUtilService } from './services/image-resizer.service';

@NgModule({
  declarations: [],
  providers: [
    StorageService,
    OtpService,
    TimerService,
    DialogService,
    NotificationService,
    ImageUtilService,
  ],
  imports: [
    LoadingComponent,
    TableComponent,
    HeaderComponent,
    FooterComponent,
  ],
  exports: [
    LoadingComponent,
    TableComponent,
    HeaderComponent,
    FooterComponent,
  ]
})
export class SharedModule { }
