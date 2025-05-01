import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/env';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const env = environment;

const config: SocketIoConfig = {
  url: env.socket,
  options: {}
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideToastr(),
    provideAnimations(), provideAnimationsAsync(), provideAnimationsAsync(),
    importProvidersFrom(
      SocketIoModule.forRoot(config)
    )
  ]
};