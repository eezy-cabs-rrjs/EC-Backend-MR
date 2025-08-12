import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { User } from '../interfaces';
import { UserService } from '@features/user/services/user.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';
import { HeaderComponent } from '@shared/components/partials/header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  loading: boolean = true;
  error: string | null = null;
  isEditing: boolean = false;

  user: User = {
    name: '',
    phone: '',
    email: '',
    tripCount: 0,
    createdAt: '',
    profilePicture: null
  };

  constructor(
    private profileService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr : ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  @ViewChild('fileInput') fileInput!: ElementRef;
  showPopup = false;
  showImageViewer = false;

  @HostListener('document:click', ['$event'])
  closePopup(event: Event) {
    const target = event.target as HTMLElement;
    const popup = target.closest('.profile-picture-container');
    const isProfileImage = target.classList.contains('profile-image');

    if (!popup || (isProfileImage && this.showPopup)) {
      this.showPopup = false;
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.showPopup = false;
    this.showImageViewer = false;
  }

  editProfile() {
    this.isEditing = true;
  }

  private validateForm(): boolean {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/; // Only letters and spaces, 2-50 chars
    const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits

    if (!nameRegex.test(this.user.name)) {
      this.toastr.error('Name must contain only letters and be between 2 and 50 characters.');
      return false;
    }

    if (!phoneRegex.test(this.user.phone)) {
      this.toastr.error('Phone number must be exactly 10 digits.');
      return false;
    }

    return true;
  }


  submitEdit() {
    if (!this.validateForm()) return;

    const userId = this.getUserIdFromSessionStorage();
    if (!userId) {
      this.toastr.error('User ID not found. Please log in again.');
      return;
    }

    const formData = {
      userId,
      name: this.user.name,
      phone: this.user.phone,
    };

    this.profileService.upsertProfile(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message || 'Profile updated successfully!', "Success");
          this.router.navigate(['/user/profile']);
        } else {
          this.toastr.error(response.message || 'Failed to update profile. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.toastr.error('An unexpected error occurred. Please try again later.');
      }
    });
    this.isEditing = false;
  }

  togglePopup(event: Event) {
    event.stopPropagation();
    this.showPopup = !this.showPopup;
    if (this.showPopup) {
      this.showImageViewer = false;
    }
  }

  viewPhoto() { 
    this.showPopup = false;
    this.showImageViewer = true;
  }

  closeImageViewer(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('image-viewer-overlay') ||
      target.closest('.image-viewer-close')) {
      event.stopPropagation();
      this.showImageViewer = false;
    }
  }

  uploadNewPhoto() {
    this.fileInput.nativeElement.click();
    this.showPopup = false;
  }

  deletePhoto() {
    if (confirm('Are you sure you want to delete your profile picture?')) {
      this.user.profilePicture = '';
      // Implement your delete logic here
    }
    this.showPopup = false;
  }

  private getUserIdFromSessionStorage(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const userString = sessionStorage.getItem('user');
      if (userString) {
        try {
          const userObj = JSON.parse(userString);
          return userObj.userId || null;
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    return null;
  }


  private loadUserProfile(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userString = sessionStorage.getItem('user');
      if (userString) {
        try {
          const userObj = JSON.parse(userString);
          const userId = userObj.userId; 

          this.profileService.getProfile(userId).subscribe({
            next: (response) => {
              if (response.success && response.details) {
                const details = response.details;
                console.log(details)
                this.user = {
                  name: details.name || '', 
                  phone: details.phone || '',
                  email: details.email || '',
                  tripCount: details.trips || '0', 
                  createdAt: details.createdAt || '', 
                  profilePicture: details.profilePhoto || '',
                };
              } else {
                this.error = response.message || 'Failed to load profile data';
              }
              this.loading = false;
            },
            error: (error) => {
              console.error('Error fetching profile:', error);
              this.error = 'Failed to load profile data';
              this.loading = false;
            }
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.error = 'Invalid user data';
          this.loading = false;
        }
      }
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const userId = this.getUserIdFromSessionStorage();
      if (userId) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        this.profileService.updateImage(formData).subscribe({
          next: (response) => {
            console.log('Image updated successfully:', response);
          },
          error: (error) => {
            console.error('Error updating image:', error);
          },
        });
      } else {
        console.error('User ID not found in local storage');
      }
    }
  }

  deleteProfilePicture(): void {
    // Handle profile picture deletion
    this.user.profilePicture = null;
  }
}
