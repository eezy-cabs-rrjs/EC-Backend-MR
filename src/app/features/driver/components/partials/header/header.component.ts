import { Component } from '@angular/core';
import { LoginService } from '@features/auth/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faBars, faTimes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  menuOpen = false;
  faBars = faBars;
  faTimes = faTimes;
  faSignOutAlt = faSignOutAlt;

  constructor(
    private router: Router,
    private authService: LoginService,
    private toastr: ToastrService    
  ){}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  Logout(lgAllDevice : boolean = false) {
    const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId;
    const sessionId = JSON.parse(sessionStorage.getItem('user') || '{}').sessionId || '';
    const logoutAllDevices = lgAllDevice; 
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    }
    const data = {
      userId,
      sessionId,
      logoutAllDevices
    }
    this.authService.UserLogout(data).subscribe({
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