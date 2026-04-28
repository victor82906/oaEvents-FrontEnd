import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptorService } from './interceptors/interceptor';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
       provideHttpClient(
         withInterceptorsFromDi()
       ),{
         provide: HTTP_INTERCEPTORS,
         useClass: AppInterceptorService,
         multi: true
       }
  ]
};
