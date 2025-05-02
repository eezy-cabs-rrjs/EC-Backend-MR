import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderComponent } from '../partials/header/header.component';
import { DriverService } from '../../services/driver.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.css'
})

export class KycComponent implements OnInit {

  @ViewChild('kycForm') kycForm!: NgForm;

  constructor(
    private driverService: DriverService,
    private router: Router,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object

  ) { }

  driverDetails: any = {
    driverLicense: '',
    experience: '',
  };
  vehicleDetails: any = {
    vehicleNumber: '',
    chassisNumber: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    registrationDate: '',
    vehicleMake: '',
    vehicleModel: '',
    yearOfManufacture: '',
  };
  kycStatus: string = '';
  isEditable: boolean = true;
  submitted: boolean = false;
  rejectionReason: string = '';

  ngOnInit() {
    this.checkKycStatus();
  }

  checkKycStatus() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const user = localStorage.getItem('user');
    if (!user) {
      this.toastr.error('User  not found!', 'Error');
      // this.router.navigate(['/login']);
      return;
    }

    const parsedUser = JSON.parse(user);

    this.driverService.checkKyc(parsedUser.userId).subscribe({
      next: (response) => {
        console.table(response);

        // Populate the data regardless of status
        this.driverDetails = {
          driverLicense: response.driverLicense || '',
          experience: response.experience || '',
        };

        this.kycStatus = this.driverService.getKYCStatusLabel(response.kycStatus);
        console.log(this.kycStatus);

        this.vehicleDetails = {
          vehicleNumber: response.vehicleNumber || '',
          chassisNumber: response.chassisNumber || '',
          insuranceNumber: response.insuranceNumber || '',
          insuranceExpiry: response.insuranceExpiry || '',
          registrationDate: response.registrationDate || '',
          vehicleMake: response.vehicleMake || '',
          vehicleModel: response.vehicleModel || '',
          yearOfManufacture: response.yearOfManufacture || '',
        };

        // Set isEditable based on kycStatus
        if (this.kycStatus === 'REJECTED' ) {
          this.isEditable = false;
          this.rejectionReason = response.reason || 'No reason provided';
        } else if (this.kycStatus === 'PENDING') {
          this.isEditable = true; 
        } else {
          this.isEditable = false; 
        }

        if (this.kycForm) {
          this.kycForm.form.patchValue({
            driverLicense: this.driverDetails.driverLicense,
            experience: this.driverDetails.experience,
            vehicleNumber: this.vehicleDetails.vehicleNumber,
            chassisNumber: this.vehicleDetails.chassisNumber,
            insuranceNumber: this.vehicleDetails.insuranceNumber,
            insuranceExpiry: this.vehicleDetails.insuranceExpiry,
            registrationDate: this.vehicleDetails.registrationDate,
            vehicleMake: this.vehicleDetails.vehicleMake,
            vehicleModel: this.vehicleDetails.vehicleModel,
            yearOfManufacture: this.vehicleDetails.yearOfManufacture
          });
        }
      },
      error: (error) => {
        console.error('Error checking KYC status:', error);
        this.kycStatus = 'error';
        this.toastr.error('Error checking KYC status', 'Error');
      },
    });
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
    if (!this.isEditable) {
      this.checkKycStatus();
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.kycForm && !this.kycForm.form.valid) {
      this.toastr.error('Please check all required fields', 'Validation Error');
      return;
    }

    const user = localStorage.getItem('user');
    if (!user) {
      this.toastr.error('User not found!', 'Error');
      return;
    }

    const parsedUser = JSON.parse(user);
    const kycData = {
      userId: parsedUser.userId,
      driverLicense: this.driverDetails.driverLicense,
      experience: this.driverDetails.experience,
      vehicleNumber: this.vehicleDetails.vehicleNumber,
      chassisNumber: this.vehicleDetails.chassisNumber,
      insuranceNumber: this.vehicleDetails.insuranceNumber,
      insuranceExpiry: this.vehicleDetails.insuranceExpiry,
      registrationDate: this.vehicleDetails.registrationDate,
      vehicleMake: this.vehicleDetails.vehicleMake,
      vehicleModel: this.vehicleDetails.vehicleModel,
      yearOfManufacture: this.vehicleDetails.yearOfManufacture,
    };

    this.driverService.submitKyc(kycData).subscribe({
      next: (response) => {
        this.toastr.success('KYC Submitted!', 'Success');
        this.kycStatus = 'submitted';
        this.isEditable = false;
        this.submitted = false;
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error with KYC:', error);
        this.toastr.error('Operation Failed!', 'Error');
      }
    });
  }

}