import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorResponseInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleErrorByType(error);
        throw error;
      })
    );
  }

  private handleErrorByType(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        const validationErrors: any = error?.error?.errors;
        if (validationErrors) {
          const modelStateErrors: any[] = [];
          for (const key of Object.keys(validationErrors)) {
            if (validationErrors[key]) {
              modelStateErrors.push(validationErrors[key]);
            }
          }
          throw modelStateErrors.flat();
        } else {
          this.toastr.error(error.error.error, String(error.status));
        }
        break;
      case 401:
        this.toastr.error('Unauthorized', String(error.status));
        break;
      case 404:
        this.router.navigate(['/', 'not-found']);
        break;
      case 500:
        const navigationExtras: NavigationExtras = { state: { error: error.error } };
        this.router.navigate(['/', 'server-error'], navigationExtras);
        break;
      default:
        this.toastr.error('Unknown error');
        console.log(error);
        break;
    }
  }
}
