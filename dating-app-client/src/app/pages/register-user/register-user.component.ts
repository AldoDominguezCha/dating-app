import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { UserAccountService } from 'src/app/common/services/user-account.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit {
  public registerUserForm: FormGroup = new FormGroup({});

  @Output() cancelRegistration = new EventEmitter();

  constructor(private userAccountService: UserAccountService, private confirmationService: ConfirmationService) {}

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
