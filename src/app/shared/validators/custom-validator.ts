import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
     const password = control.get('password')?.value;
     const confirmPassword = control.get('confirmPassword')?.value;
     return password && confirmPassword && password === confirmPassword ? null : { mismatch: true };
}

export function validateFile(file: File): { valid: boolean; error?: string } {
     const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

     if (!validTypes.includes(file.type)) {
          return { valid: false, error: 'Only JPEG, PNG, or WEBP images allowed' };
     }

     if (file.size > 20 * 1024 * 1024) {
          return { valid: false, error: 'Image too large (max 20MB)' };
     }

     return { valid: true };
}
   