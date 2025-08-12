import { Injectable } from '@angular/core';

@Injectable({
     providedIn: 'root'
})
export class StorageService {
     private readonly PROCESS_ID_KEY = 'processId';
     private readonly AUTH_TOKEN_KEY = 'authToken';
     private readonly USER_KEY = 'user';

     setProcessId(processId: string): void {
          sessionStorage.setItem(this.PROCESS_ID_KEY, processId);
     }

     getProcessId(): string | null {
          return sessionStorage.getItem(this.PROCESS_ID_KEY);
     }

     removeProcessId(): void {
          sessionStorage.removeItem(this.PROCESS_ID_KEY);
     }

     setAuthData(authToken: string, user: any): void {
          sessionStorage.setItem(this.AUTH_TOKEN_KEY, authToken);
          sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
     }

     clearAuthData(): void {
          sessionStorage.removeItem(this.AUTH_TOKEN_KEY);
          sessionStorage.removeItem(this.USER_KEY);
     }
}