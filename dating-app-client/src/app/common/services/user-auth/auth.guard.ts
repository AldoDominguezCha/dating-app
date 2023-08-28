import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { UserAccountService } from './user-account.service';
import { User } from '../../models/app-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private userAccountService: UserAccountService, private toastr: ToastrService) {}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.isUserAuthenticated();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isUserAuthenticated();
  }

  private isUserAuthenticated(): Observable<boolean> {
    /* Since this observable is based on a behavior subject, it will emit the last stored value,
    we'll get a value right away upon subscribing */
    return this.userAccountService.currentUser$().pipe(
      tap((user: User | null) => {
        if (!user) {
          this.toastr.error('Unauthorized');
        }
      }),
      map((user: User | null) => !!user)
    );
  }
}
