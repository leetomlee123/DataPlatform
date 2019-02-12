import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserauthService } from './userauth.service';
import { tap } from 'rxjs/operators';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpinterceptorService implements HttpInterceptor {

  constructor(private routers: Router, private auth: UserauthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {


    // Get the auth token from the service.
    // const authToken = this.auth.auth();
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    if (!req.url.endsWith('user/users') && sessionStorage.getItem('token') != null) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + sessionStorage.getItem('token'))
      });
      return next.handle(authReq).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
          }
        }, error => {
          if (error.statusText == 'Forbidden') {
            console.log(error.statusText);
            
            this.routers.navigate(['login']);
            return of(error.message);
          }
          throw error;
        })
      )
    } else {
      return next.handle(req);
    }
  }
}
