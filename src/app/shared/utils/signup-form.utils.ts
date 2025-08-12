import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { passwordMatchValidator } from './passwordMatch.utils';

export class SignupFormUtils {
     static initializeForm(fb: any) {
          return fb.group(
               {
                    role: ['user', [Validators.required]],
                    name: ['', [Validators.required, Validators.minLength(1)]],
                    email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)]],
                    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
                    password: ['', [Validators.required, Validators.minLength(6)]],
                    confirmPassword: ['', [Validators.required]],
                    otp: ['', [Validators.pattern(/^[0-9]{6}$/)]],
                    license: [''],
                    experience: [''],
                    profilePhoto: [''],
               },
               { validators: passwordMatchValidator() }
          );
     }

     static toggleFormControls(form: FormGroup, disable: boolean): void {
          const controlsToToggle = ['role', 'name', 'email', 'phone', 'password', 'confirmPassword', 'license', 'experience', 'profilePhoto'];
          controlsToToggle.forEach((controlName) => {
               const control = form.get(controlName);
               if (control) {
                    if (disable) {
                         control.disable();
                    } else {
                         control.enable();
                    }
               }
          });
     }

     static getValidationError(form: FormGroup): string {
          const controls = form.controls;
          if (controls['name'].errors?.['required']) return 'Full Name is required.';
          if (controls['email'].errors?.['required']) return 'Email is required.';
          if (controls['email'].errors?.['pattern']) return 'Please enter a valid email address.';
          if (controls['phone'].errors?.['required']) return 'Phone Number is required.';
          if (controls['phone'].errors?.['pattern']) return 'Phone Number must be exactly 10 digits.';
          if (controls['password'].errors?.['required']) return 'Password is required.';
          if (controls['password'].errors?.['minlength']) return 'Password must be at least 6 characters long.';
          if (controls['confirmPassword'].errors?.['required']) return 'Please confirm your password.';
          if (form.errors?.['mismatch']) return 'Passwords do not match.';
          if (controls['role'].value === 'driver') {
               if (controls['license'].errors?.['required']) return 'License Number is required for drivers.';
               if (controls['experience'].errors?.['required']) return 'Driving Experience is required for drivers.';
               if (controls['experience'].errors?.['pattern']) return 'Driving Experience must be a valid number.';
               if (controls['experience'].errors?.['min']) return 'Driving Experience must be at least 1 year.';
               if (controls['experience'].errors?.['max']) return 'Driving Experience cannot exceed 80 years.';
               if (controls['profilePhoto'].errors?.['required']) return 'Profile Photo is required for drivers.';
          }
          return 'Please fill out all required fields correctly.';
     }

     static handleRoleChange(form: FormGroup, callback: (role: string) => void) {
          return form.get('role')!.valueChanges.subscribe((role) => {
               if (role === 'driver') {
                    form.get('license')!.setValidators([Validators.required, Validators.minLength(1)]);
                    form.get('experience')!.setValidators([
                         Validators.required,
                         Validators.pattern(/^[0-9]+$/),
                         Validators.min(1),
                         Validators.max(80)
                    ]);
                    form.get('profilePhoto')!.setValidators(Validators.required);
               } else {
                    form.get('license')!.clearValidators();
                    form.get('experience')!.clearValidators();
                    form.get('profilePhoto')!.clearValidators();
                    form.get('license')!.setValue('');
                    form.get('experience')!.setValue('');
                    form.get('profilePhoto')!.setValue('');
                    if (callback) callback(role);
               }
               form.get('license')!.updateValueAndValidity();
               form.get('experience')!.updateValueAndValidity();
               form.get('profilePhoto')!.updateValueAndValidity();
          });
     }
}