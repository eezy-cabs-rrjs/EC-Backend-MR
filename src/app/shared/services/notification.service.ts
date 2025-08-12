import { Injectable } from "@angular/core";
import { IndividualConfig, ToastrService } from "ngx-toastr";

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class NotificationService {
     constructor(private toastr: ToastrService) { }

     private show(
          type: NotificationType,
          message: string,
          title?: string,
          config?: Partial<IndividualConfig>
     ): void {
          this.toastr.show(message, title, config, `toast-${type}`);
     }
  
     success(message: string, title: string = 'Success', config?: Partial<IndividualConfig>): void {
          this.show('success', message, title, config);
     }

     error(message: string, title: string = 'Error', config?: Partial<IndividualConfig>): void {
          this.show('error', message, title, config);
     }

     info(message: string, title: string = 'Info', config?: Partial<IndividualConfig>): void {
          this.show('info', message, title, config);
     }

     warning(message: string, title: string = 'Warning', config?: Partial<IndividualConfig>): void {
          this.show('warning', message, title, config);
     }

     showOtpExpired(): void {
          this.error(
               'Your OTP has expired. Please request a new one.',
               'OTP Expired',
               {
                    disableTimeOut: true,
                    closeButton: true,
                    tapToDismiss: false,
               }
          );
     }

     showLoading(message: string = 'Processing...'): void {
          this.info(message, 'Please wait', {
               timeOut: 0,
               extendedTimeOut: 0,
               closeButton: true,
          });
     }

     dismissAll(): void {
          this.toastr.clear();
     }         
  
}