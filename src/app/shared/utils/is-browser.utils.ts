import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export function isBrowser(): boolean {
     const platformId = inject(PLATFORM_ID);
     return isPlatformBrowser(platformId);
}
