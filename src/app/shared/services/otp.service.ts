import { Injectable } from "@angular/core";
import { SignupService } from "@features/auth/services/signup.service";
import { lastValueFrom } from "rxjs";
import { StorageService } from "./storage.service";

@Injectable({ providedIn: 'root' })
export class OtpService {
     constructor(
          private authService: SignupService,
          private storageService: StorageService
     ) { }

     async verify(otp: string, userAgent: string) {
          const processId = this.storageService.getProcessId();
          if (!processId) throw new Error('Process ID not found');

          return lastValueFrom(
               this.authService.verifyRegistration(otp, processId, userAgent)
          );
     }
}