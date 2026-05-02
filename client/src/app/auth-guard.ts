import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.user();

  const url = state.url;
  console.log(url);

  // 1. Not logged in → redirect
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Get allowed roles from route
  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  // 3. If no role restriction → allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // 4. Role check
  if (allowedRoles.includes(user.role)) {
    return true;
  }

  // 5. Forbidden access → redirect
  router.navigate(['/']);
  return false;
};