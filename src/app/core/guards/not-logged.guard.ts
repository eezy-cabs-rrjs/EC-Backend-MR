import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const NotLoggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let authToken: string | null = null;

  if (typeof window !== 'undefined' && window.localStorage) {
    authToken = localStorage.getItem('authToken');
  }

  if (authToken) {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const user = JSON.parse(userData);
        const roleRoutes: Record<string, string> = {
          user: '/user',
          driver: '/driver',
          admin: '/admin',
        };

        const route = roleRoutes[user.role];
        if (route) {
          return router.createUrlTree([route]); 
        } else {
          console.error('Unknown user role:', user.role);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }

  return true;
};
