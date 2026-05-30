import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes(`${environment.baseUrl}`)) {
    return next(req);
  }

  const clonedReq = req.clone({
    withCredentials: true,
  });

  return next(clonedReq);
};
