import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const queryParamGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const hasQueryParam = route.queryParams['id'] !== undefined;

  if (!hasQueryParam) {
    router.navigate(['/error']); 
    return false; 
  }

  return true; 
}
