import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    if (user && user.role) {
      if (user.role === 'admin') {
        window.location.href = '/admin/';
        return false; 
      } else if (user.role === 'driver') {
        window.location.href = '/driver/';
        return false; 
      } else if (user.role === 'user') {
        return true;
      }
    }
    return true;
  }

  return true;
};
