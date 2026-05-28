import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.authChecked).pipe(

    filter(checked => checked),

    map(() => {

      const user = auth.user();

      if (!user) {
        return router.createUrlTree(['/login']);
      }

      const allowedRoles = route.data?.['roles'] as string[] | undefined;

      if (!allowedRoles || allowedRoles.includes(user.role)) {
        return true;
      }

      return router.createUrlTree(['/']);
    })
  );
};