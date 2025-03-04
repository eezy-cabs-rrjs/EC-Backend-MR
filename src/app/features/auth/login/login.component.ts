import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    role: 'user'
  };

  submitted = false;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  navigateHome() {
    this.router.navigate(['/user']);
  }

  onLogin() {
    this.submitted = true;

    if (!this.loginData.email || !this.loginData.password) {
      this.toastr.warning('Please enter a valid email and password.', 'Validation Error');
      return;
    }

    this.isLoading = true;

    this.authService.UserLogin(this.loginData.email, this.loginData.password, this.loginData.role)
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('authToken', response.authToken);
              localStorage.setItem('user', JSON.stringify(response.user));
            }

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
}
