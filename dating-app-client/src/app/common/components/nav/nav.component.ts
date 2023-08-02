import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';

import { User } from '../../models/app-user.model';
import { UserAccountService } from '../../services/user-account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @ViewChild('loginForm') loginFormRef: NgForm = new NgForm([], []);

  public currentUser: User | null = null;
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

  constructor(private userAccountService: UserAccountService) {}

  ngOnInit(): void {
    this.observeCurrentUser();
  }

  private observeCurrentUser() {
    this.userAccountService.currentUser$().subscribe({
      next: (currentUser) => {
        this.currentUser = currentUser;
      },
    });
  }

  public onSubmit() {
    this.userAccountService.logIn(this.loginFormRef.value).subscribe();
  }

  public logOut() {
    this.userAccountService.logOut();
  }
}
