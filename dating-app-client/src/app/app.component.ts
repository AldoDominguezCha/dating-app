import { Component, OnInit } from '@angular/core';
import { UserAccountService } from './common/services/user-account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Test';

  constructor(private userAccountService: UserAccountService) {}

  ngOnInit(): void {
    this.setUserIfExists();
  }

  private setUserIfExists() {
    const userAsString: string | null = localStorage.getItem('user');

    if (userAsString) {
      this.userAccountService.setCurrentUser(JSON.parse(userAsString));
    }
  }
}
