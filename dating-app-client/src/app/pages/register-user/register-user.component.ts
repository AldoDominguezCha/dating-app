import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

import { UserAccountService } from 'src/app/common/services/user-auth/user-account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit {
  public registerUserForm: FormGroup = new FormGroup({});

  @Output() cancelRegistration = new EventEmitter();

  constructor(
    private userAccountService: UserAccountService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  public confirmRegistration() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to register the new account?',
      accept: () => this.submitRegisterForm(),
    });
  }

  public submitRegisterForm() {
    this.userAccountService.registerNewUser(this.registerUserForm.value).subscribe({
      next: (user) => {
        this.registerUserForm.reset();
        this.onCancel();
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.error?.error);
      },
    });
  }

  public onCancel() {
    this.cancelRegistration.emit();
  }

  private initializeRegisterForm() {
    this.registerUserForm = new FormGroup({
      username: new FormControl(null, [Validators.required], null),
      password: new FormControl(null, [Validators.required], null),
      favoriteUserId: new FormControl(null),
    });
  }
}
