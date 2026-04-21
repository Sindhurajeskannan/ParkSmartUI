import { HttpInterceptorFn } from '@angular/common/http';

// Session-based auth — just ensure cookies are sent with every request
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({ withCredentials: true });
  return next(cloned);
};
