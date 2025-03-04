import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  navOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService

  ) { }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  Logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    this.authService.UserLogout().subscribe({
      next: (response) => {
        this.toastr.success('Logout Successful!', 'Success');
        this.router.navigate(['/user']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        this.toastr.error('Logout failed. Please try again later.', 'Error');
      },
      complete: () => {
        console.log('Logout process completed');
      }
    });
  }
}
