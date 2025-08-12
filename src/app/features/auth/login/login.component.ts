import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../services/interfaces/login.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    role: Role.USER
  };

  submitted: boolean = false;
  isLoading: boolean = false;
  passwordVisible: boolean = false;
  showAdminRole: boolean = false;

  private holdTimeout: any;

  constructor(
    private router: Router,
    private authService: LoginService,
    private toastr: ToastrService
  ) { }

  navigateHome() {
    this.router.navigate(['/user']);
  }

  onLogoHold() {
    this.holdTimeout = setTimeout(() => {
      this.revealAdminRole();
      this.toastr.info('Admin role unlocked!', 'Easter Egg Discovered', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
    }, 1500);
  }

  cancelHold() {
    clearTimeout(this.holdTimeout);
  }

  revealAdminRole() {
    this.showAdminRole = true;
  }

  onLogin() {
    this.submitted = true;

    if (!this.loginData.email || !this.loginData.password) {
      this.toastr.warning('Please enter a valid email and password.', 'Validation Error');
      return;
    }

    this.isLoading = true;
    const userAgent = navigator.userAgent;

    const data = {
      ...this.loginData,
      userAgent: userAgent
    };

    this.authService.UserLogin(data)
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (response.authToken && typeof window !== 'undefined' && window.sessionStorage) {
              sessionStorage.setItem('authToken', response.authToken);
            }

            if (response.user) {
              sessionStorage.setItem('user', JSON.stringify(response.user));

              this.toastr.success('Login Successful!', 'Success');

              switch (response.user.role) {
                case 'user':
                  this.router.navigate(['/user/']);
                  break;
                case 'driver':
                  this.router.navigate(['/driver/']);
                  break;
                case 'admin':
                  this.router.navigate(['/admin/']);
                  break;
              }
            } else {
              this.toastr.error('User information missing', 'Error');
            }
          } else {
            this.toastr.error(response.message || 'Login failed', 'Error');
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.toastr.error(error.message, 'Error');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          console.log('Login process completed');
        }
      });
  }

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    this.passwordVisible = !this.passwordVisible;

    const input = document.getElementById('password') as HTMLInputElement;
    if (input) {
      input.type = this.passwordVisible ? 'text' : 'password';
    }
  }

}
