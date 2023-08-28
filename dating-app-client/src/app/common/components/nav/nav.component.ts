import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../models/app-user.model';
import { UserAccountService } from '../../services/user-auth/user-account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild('loginForm') loginFormRef: NgForm = new NgForm([], []);

  public currentUser: User | null = null;
  public ngUnsubscribe = new Subject();
  public navMenuItems: MenuItem[] = [
    {
      label: 'Actions',
      items: [
        {
          label: 'Edit Profile',
          icon: 'pi pi-user-edit',
          command: (event: Event) => {
            console.log('Edit Profile clicked!');
          },
        },
        {
          label: 'Log Out',
          icon: 'pi pi-sign-out',
          command: (event: Event) => {
            this.logOut();
          },
        },
      ],
    },
  ];

  constructor(private userAccountService: UserAccountService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.observeCurrentUser();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  private observeCurrentUser() {
    this.userAccountService
      .currentUser$()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (currentUser) => {
          this.currentUser = currentUser;
        },
        complete: () => {
          console.log('Check, the compound observable has completed dut to the takeUntil operator');
        },
      });
  }

  public onSubmit() {
    this.userAccountService.logIn(this.loginFormRef.value).subscribe({
      next: () => {
        this.router.navigate(['/', 'members']);
      },
    });
  }

  public logOut() {
    this.userAccountService.logOut();
    this.router.navigate(['/']);
  }
}
