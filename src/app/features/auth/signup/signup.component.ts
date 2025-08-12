import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { CommonModule } from '@angular/common';
import { lastValueFrom, Subscription } from 'rxjs';
import { isProcessCheckResponse, RegistrationFormData } from '../services/interfaces/signup.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SignupFormUtils } from '@shared/utils/signup-form.utils';
import { StorageService } from '@shared/services/storage.service';
import { validateFile } from '@shared/validators/custom-validator';
import { NotificationService } from '@shared/services/notification.service';
import { TimerService } from '@shared/services/timer.service';
import { SignupStateService } from '../services/signup-state.service';
import { ImageUtilService } from '@shared/services/image-resizer.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  isOtpSent = false;
  isOtpVerified = false;
  otpTimer = 1800;
  resendTimer = 0;
  isOtpExpired = false;
  registrationInProgress = false;
  isResumingRegistration = false;
  intervalId: any;
  profilePhotoPreview: string | null = null;
  private roleSubscription: Subscription | null = null;
  resendIntervals = [60, 120, 180, 240, 300, 600, 900];
  currentResendIndex = 0;
  passwordVisible = {
    password: false,
    confirmPassword: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: SignupService,
    private router: Router,
    private dialog: MatDialog,
    private storageService: StorageService,
    private notifications: NotificationService,
    public state: SignupStateService,
    private timerService: TimerService,
    private imageUtil: ImageUtilService

  ) {
    this.signupForm = SignupFormUtils.initializeForm(this.fb);
  }

  ngOnInit(): void {
    this.roleSubscription = SignupFormUtils.handleRoleChange(
      this.signupForm,
      (preview) => this.profilePhotoPreview = preview
    );
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.roleSubscription) this.roleSubscription.unsubscribe();
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    this.passwordVisible[field] = !this.passwordVisible[field];
    const input = document.getElementById(field === 'password' ? 'password' : 'confirm-password') as HTMLInputElement;
    if (input) input.type = this.passwordVisible[field] ? 'text' : 'password';
  }


  async sendOtp(): Promise<void> {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.notifications.error(SignupFormUtils.getValidationError(this.signupForm));
      return;
    }

    this.state.setRegistrationInProgress(true);
    const { email } = this.signupForm.value;
    this.notifications.showLoading('Sending OTP...');

    try {
      const processCheck = await lastValueFrom(this.authService.checkProcess({ email }));
      if (!processCheck) {
        this.notifications.error('Failed to check process status');
        return;
      }

      if (processCheck.accountExists) {
        this.notifications.error('Account already exists');
        return;
      }

      const response = await lastValueFrom(
        this.authService.saveRegistrationProgress(this.prepareFormData())
      );

      if (!response?.success || !response.processId) {
        this.notifications.error(response?.message || 'Failed to send OTP');
        return;
      }

      this.handleSuccessfulOtpSend(response.processId);
    } catch (error) {
      this.notifications.error('Failed to send OTP');
      console.error('OTP send error:', error);
    } finally {
      this.state.setRegistrationInProgress(false);
    }
  }

  private handleSuccessfulOtpSend(processId: string) {
    this.state.setOtpSent(true);
    this.state.setOtpTimer(this.state.otpValidityDuration);
    this.state.resendTimer = this.state.resendIntervals[0];
    this.state.currentResendIndex = 0;

    this.timerService.startTimer(this.state.otpValidityDuration, (remaining) => {
      this.state.setOtpTimer(remaining);
      if (remaining <= 0) this.handleOtpExpired();
    });

    SignupFormUtils.toggleFormControls(this.signupForm, true);
    this.signupForm.get('otp')?.enable();
    this.notifications.success('OTP sent successfully!');
    this.storageService.setProcessId(processId);
  }

  private handleOtpExpired() {
    this.state.isOtpExpired = true;
    this.notifications.showOtpExpired();
    this.signupForm.get('otp')?.disable();
  }

  async checkEmailAndLoadProgress() {
    const email = this.signupForm.get('email')?.value;
    if (!email || !this.signupForm.get('email')?.valid) return;

    this.state.setRegistrationInProgress(true);
    try {
      const response = await lastValueFrom(this.authService.checkProcess({ email }));
      if (isProcessCheckResponse(response) && response.processExists && response.process) {
        await this.handleExistingProcess(response.process);
      }
    } catch (error) {
      this.notifications.error('Failed to check registration progress');
      console.error('Process check error:', error);
    } finally {
      this.state.setRegistrationInProgress(false);
    }
  }

  private async handleExistingProcess(process: any) {
    this.state.isResumingRegistration = true;
    const confirmResume = await lastValueFrom(
      this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          message: 'Previous registration progress found. Do you want to continue or start fresh?',
        },
      }).afterClosed()
    );

    if (confirmResume) {
      this.resumeProcess(process);
    } else {
      this.clearExistingProcess(process.id);
    }
  }

  private resumeProcess(process: any) {
    this.state.setOtpSent(true);
    this.state.setOtpTimer(Math.max(0, Math.floor((new Date(process.expiresAt).getTime() - Date.now()) / 1000)));
    this.state.resendTimer = 0;

    this.timerService.startTimer(this.state.otpTimer, (remaining) => {
      this.state.setOtpTimer(remaining);
      if (remaining <= 0) this.handleOtpExpired();
    });

    this.storageService.setProcessId(process.id);
    this.signupForm.get('otp')?.enable();
    this.notifications.info('Enter OTP to continue registration.');

    if (this.state.otpTimer <= 0) {
      this.handleOtpExpired();
      this.state.isResumingRegistration = false;
      this.storageService.removeProcessId();
    }
  }

  private clearExistingProcess(processId: string) {
    this.authService.deleteRegistrationProgress(processId).subscribe({
      next: () => {
        this.notifications.success('Previous progress cleared. Start fresh.');
        this.resetToFresh();
      },
      error: () => {
        this.notifications.error('Failed to clear previous progress');
      },
    });
  }

  async resendOtp() {
    if (this.state.isResumingRegistration) {
      this.notifications.warning('Cannot resend OTP while resuming registration');
      return;
    }

    const processId = this.storageService.getProcessId();
    if (!processId) {
      this.notifications.error('Process ID not found. Please start registration again.');
      this.resetToFresh();
      return;
    }

    this.state.setRegistrationInProgress(true);
    try {
      const response = await lastValueFrom(this.authService.resendOtp(processId));
      if (!response.success) {
        this.notifications.error(response.message || 'Failed to resend OTP');
        return;
      }

      this.handleSuccessfulOtpResend();
    } catch (error) {
      this.notifications.error('Failed to resend OTP');
      console.error('Resend OTP error:', error);
    } finally {
      this.state.setRegistrationInProgress(false);
    }
  }

  private handleSuccessfulOtpResend() {
    this.state.setOtpTimer(this.state.otpValidityDuration);
    this.state.isOtpExpired = false;
    this.state.currentResendIndex = Math.min(this.state.currentResendIndex + 1, this.state.resendIntervals.length - 1);
    this.state.resendTimer = this.state.resendIntervals[this.state.currentResendIndex];
    this.notifications.success('OTP resent successfully!');
    this.signupForm.get('otp')?.reset();
    this.signupForm.get('otp')?.enable();
  }

  verifyOtp() {
    const processId = this.storageService.getProcessId();
    if (!processId) {
      this.notifications.error('Process ID not found. Please start registration again.');
      this.resetToFresh();
      return;
    }

    const otp = this.signupForm.get('otp')?.value;
    if (!otp || !/^[0-9]{6}$/.test(otp)) {
      this.notifications.error('Please enter a valid 6-digit OTP.');
      return;
    }

    this.state.setRegistrationInProgress(true);
    const userAgent = navigator.userAgent;

    const data = {otp, userAgent, processId}
    this.authService.verifyRegistration(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.handleSuccessfulVerification(response);
        } else {
          this.notifications.error(response.message || 'Verification failed. Please try again.');
        }
      },
      error: (error) => {
        this.notifications.error('Something went wrong. Please try again later.');
        console.error('OTP verification failed:', error);
      },
      complete: () => {
        this.state.setRegistrationInProgress(false);
      }
    });
  }

  private handleSuccessfulVerification(response: any) {
    this.storageService.removeProcessId();
    this.notifications.success('Verification successful!');
    this.state.setOtpVerified(true);
    this.storageService.setAuthData(response.authToken, response.user);
    this.router.navigate([response.user.role === 'user' ? '/user' : '/driver']);
  }

  private resetToFresh() {
    this.signupForm.reset({ role: 'user' });
    this.state.resetOtpState();
    this.state.setRegistrationInProgress(false);
    this.state.profilePhotoPreview = null;
    SignupFormUtils.toggleFormControls(this.signupForm, false);
    this.storageService.removeProcessId();
    this.timerService.clearTimer();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;

    const file = input.files[0];
    const validation = validateFile(file);

    if (!validation.valid) {
      this.notifications.error(validation.error!);
      return;
    }

    this.notifications.showLoading('Optimizing image...');

    this.imageUtil.compressImage(file).subscribe({
      next: ({ file: compressedFile, preview }) => {
        const pureBase64 = preview.replace(/^data:.+;base64,/, '');
        this.signupForm.get('profilePhoto')?.setValue(pureBase64);
        this.state.profilePhotoPreview = preview;
        this.notifications.dismissAll()
      },
      error: (err) => {
        console.error(err);
        this.notifications.error('Image processing failed - using original');
        // Fallback to original
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          this.signupForm.get('profilePhoto')?.setValue(dataUrl.replace(/^data:.+;base64,/, ''));
          this.state.profilePhotoPreview = dataUrl;
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  private prepareFormData(): Omit<RegistrationFormData, 'confirmPassword' | 'expiresAt'> {
    return {
      role: this.signupForm.value.role,
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      phone: this.signupForm.value.phone,
      password: this.signupForm.value.password,
      license: this.signupForm.value.license,
      experience: this.signupForm.value.experience,
      profilePhoto: this.signupForm.value.profilePhoto
    };
  }

  removeProfilePhoto(): void {
    this.signupForm.get('profilePhoto')?.reset();
    this.state.profilePhotoPreview = null;

    const fileInput = document.getElementById('profilePhoto') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
}