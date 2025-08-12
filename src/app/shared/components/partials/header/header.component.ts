import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '@features/auth/services/login.service';

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
export class HeaderComponent implements OnInit {
  sidebarOpen = false;
  userName: string = '';

  constructor(
    private router: Router,
    private authService: LoginService,
    private toastr: ToastrService
  ) { }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit() {
    this.isUserLoggedIn();
  }

  isUserLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const authToken = sessionStorage.getItem('authToken');
      const user = sessionStorage.getItem('user');

      if (authToken && user) {
        const parsedUser = JSON.parse(user);
        this.userName = parsedUser.name;
        return true;
      }
    }
    return false;
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