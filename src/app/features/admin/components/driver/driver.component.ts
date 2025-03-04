import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../partials/header/header.component';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [
        HeaderComponent,
        FormsModule,
        CommonModule,
        RouterModule
  ],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.css'
})
export class DriverComponent implements OnInit {

  constructor(
      private adminService: AdminService,
      private router: Router,
      private route: ActivatedRoute,
      private toastr: ToastrService
    ) { }
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
  isBlocked: boolean = false;
  imageUrl : string = '../../../../../assets/img/profile/taxi driver.png';

  ngOnInit(): void {
      
  }

  approveKYC(){}

  rejectKYC(){}

  blockDriver() {
    this.isBlocked = true;
  }

  unblockDriver() {
    this.isBlocked = false; 
  }


}
