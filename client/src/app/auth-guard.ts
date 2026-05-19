import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.user();

  const url = state.url;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }


  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (allowedRoles.includes(user.role)) {
    return true;
  }

  router.navigate(['/']);
  return false;
};