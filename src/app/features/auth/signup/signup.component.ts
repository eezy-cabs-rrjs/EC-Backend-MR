import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  registerData = {
    role: 'user',
    name: '',
    email: '',
    password: '',
    phone: '',
    otp: '',
    confirmPassword: '',
  };
  isOtpSent = false;
  isOtpVerified = false;
  otpTimer = 60;
  intervalId: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  validateField(): string | null {
    // Check each field in order of importance
    if (!this.registerData.name || this.registerData.name.trim().length === 0) {
      return 'Full Name is required.';
    }

    if (!this.registerData.email) {
      return 'Email is required.';
    }

    if (!this.registerData.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
      return 'Please enter a valid email address.';
    }

    if (!this.registerData.phone) {
      return 'Phone Number is required.';
    }

    if (!this.registerData.phone.match(/^[0-9]{10}$/)) {
      return 'Phone Number must be exactly 10 digits.';
    }

    if (!this.registerData.password) {
      return 'Password is required.';
    }

    if (this.registerData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (!this.registerData.confirmPassword) {
      return 'Please confirm your password.';
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  }

  sendOtp() {
    const validationError = this.validateField();
    if (validationError) {
      this.toastr.error(validationError, 'Validation Error');
      return;
    }

    console.log('Sending OTP');
    this.toastr.info('Sending OTP...', 'Please wait');

    this.authService.SendOtp(this.registerData.email, this.registerData.name).subscribe({
      next: (response) => {
        if (response.success) {
          this.isOtpSent = true;
          this.otpTimer = 300;
          this.startTimer();
          this.toastr.success('OTP sent successfully!', 'Success');
          localStorage.setItem('otpToken', response.token);
        } else {
          this.toastr.error(response.message || 'Failed to send OTP.', 'Error');
        }
      },
      error: (error) => {
        console.error('Error sending OTP:', error);
        this.toastr.error('Something went wrong. Please try again later.', 'Error');
      }
    });
  }
  verifyOtp() {
    const token = localStorage.getItem('otpToken');

    if (!token) {
      this.toastr.error('Token not found. Please request a new OTP.', 'Error');
      return;
    }

    this.authService.VerifyOtp(this.registerData.otp, token).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.removeItem('otpToken');
          this.toastr.success('Verification successful!', 'Success');
          this.isOtpVerified = true;
          this.onRegister();
        } else {
          this.toastr.error(response.message || 'Verification failed. Please try again.', 'Error');
        }
      },
      error: (error) => {
        console.error('OTP verification failed:', error);
        this.toastr.error('Something went wrong. Please try again later.', 'Error');
      }
    });
  }

  startTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear existing timer to prevent multiple timers
    }

    this.intervalId = setInterval(() => {
      this.otpTimer--;

      if (this.otpTimer <= 0) {
        clearInterval(this.intervalId);
        this.toastr.info('OTP has expired. Please request a new OTP.', 'Info');
        this.isOtpSent = false; // Reset OTP sent state
      }
    }, 1000);
  }

  get formattedOtpTimer(): string {
    const minutes = Math.floor(this.otpTimer / 60);
    const seconds = this.otpTimer % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  onRegister() {
    console.log('Registration Data:', this.registerData);
    this.authService.UserRegister(this.registerData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message || 'Registration successful!', 'Success');

          const { authToken, refreshToken, user } = response;
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(user));
          }
          switch (response.user.role) {
            case 'user':
              this.router.navigate(['/user']);
              break;
            case 'driver':
              this.router.navigate(['/driver']);
              break;
          }

        } else {
          this.toastr.error(response.message || 'Registration failed. Please try again.', 'Error');
        }
      },
      error: (error) => {
        console.error('Error during registration:', error);

        this.toastr.error(
          error.error?.message || 'An unexpected error occurred. Please try again later.',
          'Error'
        );
      }
    });
  }
}