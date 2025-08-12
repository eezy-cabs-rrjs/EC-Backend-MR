import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignupStateService {
     private readonly OTP_VALIDITY_DURATION = 1800;
     private isOtpSentSubject = new BehaviorSubject<boolean>(false);
     private isOtpVerifiedSubject = new BehaviorSubject<boolean>(false);
     private otpTimerSubject = new BehaviorSubject<number>(this.OTP_VALIDITY_DURATION);
     private registrationInProgressSubject = new BehaviorSubject<boolean>(false);

     isOtpSent$ = this.isOtpSentSubject.asObservable();
     isOtpVerified$ = this.isOtpVerifiedSubject.asObservable();
     otpTimer$ = this.otpTimerSubject.asObservable();
     registrationInProgress$ = this.registrationInProgressSubject.asObservable();

     resendIntervals = [60, 120, 180, 240, 300, 600, 900];
     currentResendIndex = 0;
     resendTimer = 0;
     isOtpExpired = false;
     isResumingRegistration = false;
     profilePhotoPreview: string | null = null;
     private _imageProcessing = new BehaviorSubject<boolean>(false);
     imageProcessing$ = this._imageProcessing.asObservable();

     setImageProcessing(state: boolean): void {
          this._imageProcessing.next(state);
     }


     get isOtpSent(): boolean {
          return this.isOtpSentSubject.value;
     }

     get otpValidityDuration(): number {
          return this.OTP_VALIDITY_DURATION;
     }

     get isOtpVerified(): boolean {
          return this.isOtpVerifiedSubject.value;
     }

     get otpTimer(): number {
          return this.otpTimerSubject.value;
     }

     get registrationInProgress(): boolean {
          return this.registrationInProgressSubject.value;
     }

     setOtpSent(value: boolean): void {
          this.isOtpSentSubject.next(value);
     }

     setOtpVerified(value: boolean): void {
          this.isOtpVerifiedSubject.next(value);
     }

     setOtpTimer(value: number): void {
          this.otpTimerSubject.next(value);
     }

     setRegistrationInProgress(value: boolean): void {
          this.registrationInProgressSubject.next(value);
     }

     resetOtpState(): void {
          this.setOtpSent(false);
          this.setOtpVerified(false);
          this.setOtpTimer(this.OTP_VALIDITY_DURATION);
          this.resendTimer = 0;
          this.isOtpExpired = false;
          this.currentResendIndex = 0;
          this.isResumingRegistration = false;
     }

     get formattedOtpTimer(): string {
          const minutes = Math.floor(this.otpTimer / 60);
          const seconds = this.otpTimer % 60;
          return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
     }

     get formattedResendTimer(): string {
          if (this.isResumingRegistration || this.resendTimer <= 0) return '';
          const minutes = Math.floor(this.resendTimer / 60);
          const seconds = this.resendTimer % 60;
          return `Resend available in ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
     }
}