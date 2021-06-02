import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {switchMap, take} from 'rxjs/operators';
import {serverUrl} from '../utils/constants';

const addCorsHeaders = req => {
  return req.headers
    .set('Access-Control-Allow-Origin', serverUrl
    ).set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');
};

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(
    private auth: AngularFireAuth
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.idToken.pipe(
      take(1),
      switchMap(idToken => {
        let clone = req.clone();
        if (idToken) {
          clone = clone.clone({headers: addCorsHeaders(req).set('Authorization', 'Bearer ' + idToken)});
        }
        return next.handle(clone);
      })
    );
  }
}

export const AuthTokenHttpInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthTokenInterceptor,
  multi: true
};
