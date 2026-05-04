import { CanActivateFn } from '@angular/router';
import {AuthService} from '../services/auth/auth-service';
import {inject} from '@angular/core';

export const rolGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  const roles: string[] = route.data['roles'];

  if (roles.includes(authService.getRol())) {
    return true;
  } else {
    return false;
  }

};
