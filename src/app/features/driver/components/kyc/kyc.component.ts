import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderComponent } from '../partials/header/header.component';
import { KycService } from '../../services/kyc.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FooterComponent } from '@shared/components/partials/footer/footer.component';

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ToastrModule
  ],
  templateUrl: './kyc.component.html',
  styleUrl: './kyc.component.css'
})
export class KycComponent implements OnInit {
  @ViewChild('kycForm') kycForm!: NgForm;

  constructor(
    private kycService: KycService,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  driverDetails: any = {
    driverLicense: '',
    experience: ''
  };
  vehicleDetails: any = {
    vehicleNumber: '',
    chassisNumber: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    registrationDate: '',
    vehicleMake: '',
    vehicleModel: '',
    yearOfManufacture: ''
  };

  kycStatus: string = 'INCOMPLETE';
  isEditable: boolean = true;
  submitted: boolean = false;
  rejectionReason: string = '';
  currentStep: string = 'kyc-information';

  ngOnInit() {
    this.checkKycStatus();
  }

  checkKycStatus() {
    if (!isPlatformBrowser(this.platformId)) return;

    const user = sessionStorage.getItem('user');
    if (!user) {
      this.toastr.error('User not found!', 'Error');
      return;
    }

    const parsedUser = JSON.parse(user);
    this.kycService.checkKyc(parsedUser.userId).subscribe({
      next: (response) => {
        this.driverDetails = {
          driverLicense: response.driverLicense || '',
          experience: response.experience || ''
        };
        const vehicle = response.vehicles && response.vehicles.length > 0 ? response.vehicles[0] : {};
        this.vehicleDetails = {
          vehicleNumber: vehicle.vehicleNumber || '',
          chassisNumber: vehicle.chassisNumber || '',
          insuranceNumber: vehicle.insuranceNumber || '',
          insuranceExpiry: vehicle.insuranceExpiry || '',
          registrationDate: vehicle.registrationDate || '',
          vehicleMake: vehicle.vehicleMake || '',
          vehicleModel: vehicle.vehicleModel || '',
          yearOfManufacture: vehicle.yearOfManufacture || ''
        };
        this.kycStatus = this.kycService.getKYCStatusLabel(response.kycStatus);

        if (this.kycStatus === 'INCOMPLETE') {
          this.checkIncompleteFormData(parsedUser.userId);
        } else if (this.kycStatus === 'REJECTED') {
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
      }
    });
  }

  checkIncompleteFormData(userId: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.kycService.getIncompleteKycFormData(userId);
  }

  resumeForm(savedData: any, savedStep: string) {
    this.driverDetails = {
      driverLicense: savedData.driverLicense || '',
      experience: savedData.experience || ''
    };
    this.vehicleDetails = {
      vehicleNumber: savedData.vehicleNumber || '',
      chassisNumber: savedData.chassisNumber || '',
      insuranceNumber: savedData.insuranceNumber || '',
      insuranceExpiry: savedData.insuranceExpiry || '',
      registrationDate: savedData.registrationDate || '',
      vehicleMake: savedData.vehicleMake || '',
      vehicleModel: savedData.vehicleModel || '',
      yearOfManufacture: savedData.yearOfManufacture || ''
    };
    this.currentStep = savedStep || 'driver-information';

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
  }

  resetForm() {
    this.driverDetails = { driverLicense: '', experience: '' };
    this.vehicleDetails = {
      vehicleNumber: '',
      chassisNumber: '',
      insuranceNumber: '',
      insuranceExpiry: '',
      registrationDate: '',
      vehicleMake: '',
      vehicleModel: '',
      yearOfManufacture: ''
    };
    this.currentStep = 'driver-information';
    if (this.kycForm) this.kycForm.resetForm();
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
    if (!this.isEditable) {
      this.checkKycStatus();
    }
  }

  onFieldBlur(fieldName: string, section: string) {
    if (!isPlatformBrowser(this.platformId) || !this.isEditable) return;

    const user = sessionStorage.getItem('user');
    if (!user) return;

    const parsedUser = JSON.parse(user);
    this.currentStep = section;

    const formData: any = {};
    if (section === 'driver-information') {
      if (this.driverDetails[fieldName]) {
        formData[fieldName] = this.driverDetails[fieldName];
      }
    } else if (section === 'vehicle-information') {
      if (this.vehicleDetails[fieldName]) {
        formData[fieldName] = this.vehicleDetails[fieldName];
      }
    }

    if (Object.keys(formData).length === 0) return;

    this.kycService.saveKycFormData(parsedUser.userId, formData, this.currentStep).subscribe({
      next: (response) => {
        this.toastr.success('Progress saved', 'Success', { timeOut: 2000 });
      },
      error: (error) => {
        console.error('Error saving KYC data:', error);
        this.toastr.error('Failed to save progress', 'Error');
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.kycForm && !this.kycForm.form.valid) {
      this.toastr.error('Please check all required fields', 'Validation Error');
      return;
    }

    const user = sessionStorage.getItem('user');
    if (!user) {
      this.toastr.error('User not found!', 'Error');
      return;
    }

    const parsedUser = JSON.parse(user);
    const kycData = {
      userId: parsedUser.userId,
      driverLicense: this.driverDetails.driverLicense,
      experience: this.driverDetails.experience
    };

    this.kycService.submitKyc(kycData).subscribe({
      next: (response) => {
        this.toastr.success('KYC Submitted!', 'Success');
        this.kycStatus = 'SUBMITTED';
        this.isEditable = false;
        this.submitted = false;
        this.kycService.clearKycProcessData(parsedUser.userId).subscribe({
          next: () => {
            this.ngOnInit();
          }
        });
      },
      error: (error) => {
        console.error('Error with KYC:', error);
        this.toastr.error('Operation Failed!', 'Error');
      }
    });
  }
}