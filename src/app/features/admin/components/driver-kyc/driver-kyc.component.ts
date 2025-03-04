import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../partials/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-driver-kyc',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './driver-kyc.component.html',
  styleUrl: './driver-kyc.component.css'
})
export class DriverKycComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['id']; 
      console.log('User  ID:', this.userId); 

      this.adminService.fetchDriverKyc(this.userId).subscribe(
        (response) => {
          this.driverDetails = {
            driver_license: response.detail.driverLicense,
            experience: response.detail.experience,
          };
          this.vehicleDetails = {
            vehicleNumber: response.vehicle.vehicleNo,
            chassisNumber: response.vehicle.chassisNo,
            insuranceNumber: response.vehicle.insuranceNo,
            insuranceExpiry: response.vehicle.insuranceExpiry,
            registrationDate: response.vehicle.registrationDate,
            vehicleMake: response.vehicle.vehicleMake,
            vehicleModel: response.vehicle.vehicleModel,
            yearOfManufacture: response.vehicle.yearOfManufacture,
          };
        },
        (error) => {
          console.error('Error fetching KYC details:', error);
          this.toastr.error('Failed to fetch KYC details.');
        }
      );
    });
  }

  driverDetails: any = {
    driver_license: '',
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
  userId: string = '';
  isEditable: boolean = false;

  approveKYC() {
    const approval = true;
    this.adminService.approveKYC({ userId: this.userId, approval }).subscribe(
      (response) => {
        this.toastr.success('KYC approved successfully!');
        this.router.navigate(['/admin/kyc-list']);
      },
      (error) => {
        console.error('Error approving KYC:', error);
        this.toastr.error('Failed to approve KYC.');
      }
    );
  }

  rejectKYC() {
    const approval = false;
    this.adminService.approveKYC({ userId: this.userId, approval }).subscribe(
      (response) => {
        this.toastr.success('KYC rejected successfully!');
        this.router.navigate(['/admin/kyc-list']);
      },
      (error) => {
        console.error('Error rejecting KYC:', error);
        this.toastr.error('Failed to reject KYC.');
      }
    );
  }

}
