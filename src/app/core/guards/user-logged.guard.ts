import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userLoggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let authToken: string | null = null;
  let user: {
    role: string;
    userId: string;
    name: string;
    email: string;
  } = { role: '', userId: '', name: '', email: '' };

  if (typeof window !== 'undefined' && window.localStorage) {
    authToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
      }
    }
  }

  if (!authToken || !user || user.role !== 'user') {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
